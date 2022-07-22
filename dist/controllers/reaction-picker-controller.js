"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactionPickerView = _interopRequireDefault(require("../views/reaction-picker-view"));

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReactionPickerController extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "addReactionAndClose", async content => {
      await this.props.addReaction(content);
      (0, _reporterProxy.addEvent)('add-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });

    _defineProperty(this, "removeReactionAndClose", async content => {
      await this.props.removeReaction(content);
      (0, _reporterProxy.addEvent)('remove-emoji-reaction', {
        package: 'github'
      });
      this.props.tooltipHolder.map(tooltip => tooltip.dispose());
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_reactionPickerView.default, _extends({
      addReactionAndClose: this.addReactionAndClose,
      removeReactionAndClose: this.removeReactionAndClose
    }, this.props));
  }

}

exports.default = ReactionPickerController;

_defineProperty(ReactionPickerController, "propTypes", {
  addReaction: _propTypes.default.func.isRequired,
  removeReaction: _propTypes.default.func.isRequired,
  tooltipHolder: _propTypes2.RefHolderPropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yZWFjdGlvbi1waWNrZXItY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJSZWFjdGlvblBpY2tlckNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnRlbnQiLCJwcm9wcyIsImFkZFJlYWN0aW9uIiwicGFja2FnZSIsInRvb2x0aXBIb2xkZXIiLCJtYXAiLCJ0b29sdGlwIiwiZGlzcG9zZSIsInJlbW92ZVJlYWN0aW9uIiwicmVuZGVyIiwiYWRkUmVhY3Rpb25BbmRDbG9zZSIsInJlbW92ZVJlYWN0aW9uQW5kQ2xvc2UiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIlJlZkhvbGRlclByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsd0JBQU4sU0FBdUNDLGVBQU1DLFNBQTdDLENBQXVEO0FBQUE7QUFBQTs7QUFBQSxpREFrQjlDLE1BQU1DLE9BQU4sSUFBaUI7QUFDckMsWUFBTSxLQUFLQyxLQUFMLENBQVdDLFdBQVgsQ0FBdUJGLE9BQXZCLENBQU47QUFDQSxtQ0FBUyxvQkFBVCxFQUErQjtBQUFDRyxRQUFBQSxPQUFPLEVBQUU7QUFBVixPQUEvQjtBQUNBLFdBQUtGLEtBQUwsQ0FBV0csYUFBWCxDQUF5QkMsR0FBekIsQ0FBNkJDLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxPQUFSLEVBQXhDO0FBQ0QsS0F0Qm1FOztBQUFBLG9EQXdCM0MsTUFBTVAsT0FBTixJQUFpQjtBQUN4QyxZQUFNLEtBQUtDLEtBQUwsQ0FBV08sY0FBWCxDQUEwQlIsT0FBMUIsQ0FBTjtBQUNBLG1DQUFTLHVCQUFULEVBQWtDO0FBQUNHLFFBQUFBLE9BQU8sRUFBRTtBQUFWLE9BQWxDO0FBQ0EsV0FBS0YsS0FBTCxDQUFXRyxhQUFYLENBQXlCQyxHQUF6QixDQUE2QkMsT0FBTyxJQUFJQSxPQUFPLENBQUNDLE9BQVIsRUFBeEM7QUFDRCxLQTVCbUU7QUFBQTs7QUFRcEVFLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFLDZCQUFDLDJCQUFEO0FBQ0UsTUFBQSxtQkFBbUIsRUFBRSxLQUFLQyxtQkFENUI7QUFFRSxNQUFBLHNCQUFzQixFQUFFLEtBQUtDO0FBRi9CLE9BR00sS0FBS1YsS0FIWCxFQURGO0FBT0Q7O0FBaEJtRTs7OztnQkFBakRKLHdCLGVBQ0E7QUFDakJLLEVBQUFBLFdBQVcsRUFBRVUsbUJBQVVDLElBQVYsQ0FBZUMsVUFEWDtBQUVqQk4sRUFBQUEsY0FBYyxFQUFFSSxtQkFBVUMsSUFBVixDQUFlQyxVQUZkO0FBSWpCVixFQUFBQSxhQUFhLEVBQUVXLDhCQUFrQkQ7QUFKaEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgUmVhY3Rpb25QaWNrZXJWaWV3IGZyb20gJy4uL3ZpZXdzL3JlYWN0aW9uLXBpY2tlci12aWV3JztcbmltcG9ydCB7UmVmSG9sZGVyUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdGlvblBpY2tlckNvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGFkZFJlYWN0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlbW92ZVJlYWN0aW9uOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgdG9vbHRpcEhvbGRlcjogUmVmSG9sZGVyUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0aW9uUGlja2VyVmlld1xuICAgICAgICBhZGRSZWFjdGlvbkFuZENsb3NlPXt0aGlzLmFkZFJlYWN0aW9uQW5kQ2xvc2V9XG4gICAgICAgIHJlbW92ZVJlYWN0aW9uQW5kQ2xvc2U9e3RoaXMucmVtb3ZlUmVhY3Rpb25BbmRDbG9zZX1cbiAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBhZGRSZWFjdGlvbkFuZENsb3NlID0gYXN5bmMgY29udGVudCA9PiB7XG4gICAgYXdhaXQgdGhpcy5wcm9wcy5hZGRSZWFjdGlvbihjb250ZW50KTtcbiAgICBhZGRFdmVudCgnYWRkLWVtb2ppLXJlYWN0aW9uJywge3BhY2thZ2U6ICdnaXRodWInfSk7XG4gICAgdGhpcy5wcm9wcy50b29sdGlwSG9sZGVyLm1hcCh0b29sdGlwID0+IHRvb2x0aXAuZGlzcG9zZSgpKTtcbiAgfVxuXG4gIHJlbW92ZVJlYWN0aW9uQW5kQ2xvc2UgPSBhc3luYyBjb250ZW50ID0+IHtcbiAgICBhd2FpdCB0aGlzLnByb3BzLnJlbW92ZVJlYWN0aW9uKGNvbnRlbnQpO1xuICAgIGFkZEV2ZW50KCdyZW1vdmUtZW1vamktcmVhY3Rpb24nLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB0aGlzLnByb3BzLnRvb2x0aXBIb2xkZXIubWFwKHRvb2x0aXAgPT4gdG9vbHRpcC5kaXNwb3NlKCkpO1xuICB9XG59XG4iXX0=