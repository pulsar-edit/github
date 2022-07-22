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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return /*#__PURE__*/_react.default.createElement(_emojiReactionsView.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJCYXJlRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb250ZW50IiwicHJvcHMiLCJyZWxheSIsImVudmlyb25tZW50IiwicmVhY3RhYmxlIiwiaWQiLCJlcnIiLCJyZXBvcnRSZWxheUVycm9yIiwicmVuZGVyIiwiYWRkUmVhY3Rpb24iLCJyZW1vdmVSZWFjdGlvbiIsIlByb3BUeXBlcyIsInNoYXBlIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsInRvb2x0aXBzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVPLE1BQU1BLDRCQUFOLFNBQTJDQyxlQUFNQyxTQUFqRCxDQUEyRDtBQUFBO0FBQUE7O0FBQUEseUNBMEJsRCxNQUFNQyxPQUFOLElBQWlCO0FBQzdCLFVBQUk7QUFDRixjQUFNLDBCQUFvQixLQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLFdBQXJDLEVBQWtELEtBQUtGLEtBQUwsQ0FBV0csU0FBWCxDQUFxQkMsRUFBdkUsRUFBMkVMLE9BQTNFLENBQU47QUFDRCxPQUZELENBRUUsT0FBT00sR0FBUCxFQUFZO0FBQ1osYUFBS0wsS0FBTCxDQUFXTSxnQkFBWCxDQUE0Qiw4QkFBNUIsRUFBNERELEdBQTVEO0FBQ0Q7QUFDRixLQWhDK0Q7O0FBQUEsNENBa0MvQyxNQUFNTixPQUFOLElBQWlCO0FBQ2hDLFVBQUk7QUFDRixjQUFNLDZCQUF1QixLQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLFdBQXhDLEVBQXFELEtBQUtGLEtBQUwsQ0FBV0csU0FBWCxDQUFxQkMsRUFBMUUsRUFBOEVMLE9BQTlFLENBQU47QUFDRCxPQUZELENBRUUsT0FBT00sR0FBUCxFQUFZO0FBQ1osYUFBS0wsS0FBTCxDQUFXTSxnQkFBWCxDQUE0QixpQ0FBNUIsRUFBK0RELEdBQS9EO0FBQ0Q7QUFDRixLQXhDK0Q7QUFBQTs7QUFnQmhFRSxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRSw2QkFBQywyQkFBRDtBQUNFLE1BQUEsV0FBVyxFQUFFLEtBQUtDLFdBRHBCO0FBRUUsTUFBQSxjQUFjLEVBQUUsS0FBS0M7QUFGdkIsT0FHTSxLQUFLVCxLQUhYLEVBREY7QUFPRDs7QUF4QitEOzs7O2dCQUFyREosNEIsZUFDUTtBQUNqQkssRUFBQUEsS0FBSyxFQUFFUyxtQkFBVUMsS0FBVixDQUFnQjtBQUNyQlQsSUFBQUEsV0FBVyxFQUFFUSxtQkFBVUUsTUFBVixDQUFpQkM7QUFEVCxHQUFoQixFQUVKQSxVQUhjO0FBSWpCVixFQUFBQSxTQUFTLEVBQUVPLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3pCUCxJQUFBQSxFQUFFLEVBQUVNLG1CQUFVSSxNQUFWLENBQWlCRDtBQURJLEdBQWhCLEVBRVJBLFVBTmM7QUFRakI7QUFDQUUsRUFBQUEsUUFBUSxFQUFFTCxtQkFBVUUsTUFBVixDQUFpQkMsVUFUVjtBQVdqQjtBQUNBUCxFQUFBQSxnQkFBZ0IsRUFBRUksbUJBQVVNLElBQVYsQ0FBZUg7QUFaaEIsQzs7ZUEwQ04seUNBQXdCakIsNEJBQXhCLEVBQXNEO0FBQ25FTyxFQUFBQSxTQUFTO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFEMEQsQ0FBdEQsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjcmVhdGVGcmFnbWVudENvbnRhaW5lciwgZ3JhcGhxbH0gZnJvbSAncmVhY3QtcmVsYXknO1xuXG5pbXBvcnQgRW1vamlSZWFjdGlvbnNWaWV3IGZyb20gJy4uL3ZpZXdzL2Vtb2ppLXJlYWN0aW9ucy12aWV3JztcbmltcG9ydCBhZGRSZWFjdGlvbk11dGF0aW9uIGZyb20gJy4uL211dGF0aW9ucy9hZGQtcmVhY3Rpb24nO1xuaW1wb3J0IHJlbW92ZVJlYWN0aW9uTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL3JlbW92ZS1yZWFjdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBCYXJlRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGVudmlyb25tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZWFjdGFibGU6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEVtb2ppUmVhY3Rpb25zVmlld1xuICAgICAgICBhZGRSZWFjdGlvbj17dGhpcy5hZGRSZWFjdGlvbn1cbiAgICAgICAgcmVtb3ZlUmVhY3Rpb249e3RoaXMucmVtb3ZlUmVhY3Rpb259XG4gICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgYWRkUmVhY3Rpb24gPSBhc3luYyBjb250ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYWRkUmVhY3Rpb25NdXRhdGlvbih0aGlzLnByb3BzLnJlbGF5LmVudmlyb25tZW50LCB0aGlzLnByb3BzLnJlYWN0YWJsZS5pZCwgY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3IoJ1VuYWJsZSB0byBhZGQgcmVhY3Rpb24gZW1vamknLCBlcnIpO1xuICAgIH1cbiAgfTtcblxuICByZW1vdmVSZWFjdGlvbiA9IGFzeW5jIGNvbnRlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCByZW1vdmVSZWFjdGlvbk11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHRoaXMucHJvcHMucmVhY3RhYmxlLmlkLCBjb250ZW50KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIHJlbW92ZSByZWFjdGlvbiBlbW9qaScsIGVycik7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGcmFnbWVudENvbnRhaW5lcihCYXJlRW1vamlSZWFjdGlvbnNDb250cm9sbGVyLCB7XG4gIHJlYWN0YWJsZTogZ3JhcGhxbGBcbiAgICBmcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gICAgICBpZFxuICAgICAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxuICAgIH1cbiAgYCxcbn0pO1xuIl19