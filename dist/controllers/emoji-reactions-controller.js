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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJCYXJlRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb250ZW50IiwicHJvcHMiLCJyZWxheSIsImVudmlyb25tZW50IiwicmVhY3RhYmxlIiwiaWQiLCJlcnIiLCJyZXBvcnRSZWxheUVycm9yIiwicmVuZGVyIiwiYWRkUmVhY3Rpb24iLCJyZW1vdmVSZWFjdGlvbiIsIlByb3BUeXBlcyIsInNoYXBlIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsInRvb2x0aXBzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVPLE1BQU1BLDRCQUFOLFNBQTJDQyxlQUFNQyxTQUFqRCxDQUEyRDtBQUFBO0FBQUE7O0FBQUEseUNBMEJsRCxNQUFNQyxPQUFOLElBQWlCO0FBQzdCLFVBQUk7QUFDRixjQUFNLDBCQUFvQixLQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLFdBQXJDLEVBQWtELEtBQUtGLEtBQUwsQ0FBV0csU0FBWCxDQUFxQkMsRUFBdkUsRUFBMkVMLE9BQTNFLENBQU47QUFDRCxPQUZELENBRUUsT0FBT00sR0FBUCxFQUFZO0FBQ1osYUFBS0wsS0FBTCxDQUFXTSxnQkFBWCxDQUE0Qiw4QkFBNUIsRUFBNERELEdBQTVEO0FBQ0Q7QUFDRixLQWhDK0Q7O0FBQUEsNENBa0MvQyxNQUFNTixPQUFOLElBQWlCO0FBQ2hDLFVBQUk7QUFDRixjQUFNLDZCQUF1QixLQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLFdBQXhDLEVBQXFELEtBQUtGLEtBQUwsQ0FBV0csU0FBWCxDQUFxQkMsRUFBMUUsRUFBOEVMLE9BQTlFLENBQU47QUFDRCxPQUZELENBRUUsT0FBT00sR0FBUCxFQUFZO0FBQ1osYUFBS0wsS0FBTCxDQUFXTSxnQkFBWCxDQUE0QixpQ0FBNUIsRUFBK0RELEdBQS9EO0FBQ0Q7QUFDRixLQXhDK0Q7QUFBQTs7QUFnQmhFRSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFLDZCQUFDLDJCQUFEO0FBQ0UsTUFBQSxXQUFXLEVBQUUsS0FBS0MsV0FEcEI7QUFFRSxNQUFBLGNBQWMsRUFBRSxLQUFLQztBQUZ2QixPQUdNLEtBQUtULEtBSFgsRUFERjtBQU9EOztBQXhCK0Q7Ozs7Z0JBQXJESiw0QixlQUNRO0FBQ2pCSyxFQUFBQSxLQUFLLEVBQUVTLG1CQUFVQyxLQUFWLENBQWdCO0FBQ3JCVCxJQUFBQSxXQUFXLEVBQUVRLG1CQUFVRSxNQUFWLENBQWlCQztBQURULEdBQWhCLEVBRUpBLFVBSGM7QUFJakJWLEVBQUFBLFNBQVMsRUFBRU8sbUJBQVVDLEtBQVYsQ0FBZ0I7QUFDekJQLElBQUFBLEVBQUUsRUFBRU0sbUJBQVVJLE1BQVYsQ0FBaUJEO0FBREksR0FBaEIsRUFFUkEsVUFOYztBQVFqQjtBQUNBRSxFQUFBQSxRQUFRLEVBQUVMLG1CQUFVRSxNQUFWLENBQWlCQyxVQVRWO0FBV2pCO0FBQ0FQLEVBQUFBLGdCQUFnQixFQUFFSSxtQkFBVU0sSUFBVixDQUFlSDtBQVpoQixDOztlQTBDTix5Q0FBd0JqQiw0QkFBeEIsRUFBc0Q7QUFDbkVPLEVBQUFBLFNBQVM7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUQwRCxDQUF0RCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2NyZWF0ZUZyYWdtZW50Q29udGFpbmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBFbW9qaVJlYWN0aW9uc1ZpZXcgZnJvbSAnLi4vdmlld3MvZW1vamktcmVhY3Rpb25zLXZpZXcnO1xuaW1wb3J0IGFkZFJlYWN0aW9uTXV0YXRpb24gZnJvbSAnLi4vbXV0YXRpb25zL2FkZC1yZWFjdGlvbic7XG5pbXBvcnQgcmVtb3ZlUmVhY3Rpb25NdXRhdGlvbiBmcm9tICcuLi9tdXRhdGlvbnMvcmVtb3ZlLXJlYWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIEJhcmVFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHJlYWN0YWJsZTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RW1vamlSZWFjdGlvbnNWaWV3XG4gICAgICAgIGFkZFJlYWN0aW9uPXt0aGlzLmFkZFJlYWN0aW9ufVxuICAgICAgICByZW1vdmVSZWFjdGlvbj17dGhpcy5yZW1vdmVSZWFjdGlvbn1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBhZGRSZWFjdGlvbiA9IGFzeW5jIGNvbnRlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhZGRSZWFjdGlvbk11dGF0aW9uKHRoaXMucHJvcHMucmVsYXkuZW52aXJvbm1lbnQsIHRoaXMucHJvcHMucmVhY3RhYmxlLmlkLCBjb250ZW50KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcignVW5hYmxlIHRvIGFkZCByZWFjdGlvbiBlbW9qaScsIGVycik7XG4gICAgfVxuICB9O1xuXG4gIHJlbW92ZVJlYWN0aW9uID0gYXN5bmMgY29udGVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJlbW92ZVJlYWN0aW9uTXV0YXRpb24odGhpcy5wcm9wcy5yZWxheS5lbnZpcm9ubWVudCwgdGhpcy5wcm9wcy5yZWFjdGFibGUuaWQsIGNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yKCdVbmFibGUgdG8gcmVtb3ZlIHJlYWN0aW9uIGVtb2ppJywgZXJyKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUZyYWdtZW50Q29udGFpbmVyKEJhcmVFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIsIHtcbiAgcmVhY3RhYmxlOiBncmFwaHFsYFxuICAgIGZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgICAgIGlkXG4gICAgICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG4gICAgfVxuICBgLFxufSk7XG4iXX0=