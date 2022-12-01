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
    return _react.default.createElement(_reactionPickerView.default, _extends({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9yZWFjdGlvbi1waWNrZXItY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJSZWFjdGlvblBpY2tlckNvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnRlbnQiLCJwcm9wcyIsImFkZFJlYWN0aW9uIiwicGFja2FnZSIsInRvb2x0aXBIb2xkZXIiLCJtYXAiLCJ0b29sdGlwIiwiZGlzcG9zZSIsInJlbW92ZVJlYWN0aW9uIiwicmVuZGVyIiwiYWRkUmVhY3Rpb25BbmRDbG9zZSIsInJlbW92ZVJlYWN0aW9uQW5kQ2xvc2UiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIlJlZkhvbGRlclByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsd0JBQU4sU0FBdUNDLGVBQU1DLFNBQTdDLENBQXVEO0FBQUE7QUFBQTs7QUFBQSxpREFrQjlDLE1BQU1DLE9BQU4sSUFBaUI7QUFDckMsWUFBTSxLQUFLQyxLQUFMLENBQVdDLFdBQVgsQ0FBdUJGLE9BQXZCLENBQU47QUFDQSxtQ0FBUyxvQkFBVCxFQUErQjtBQUFDRyxRQUFBQSxPQUFPLEVBQUU7QUFBVixPQUEvQjtBQUNBLFdBQUtGLEtBQUwsQ0FBV0csYUFBWCxDQUF5QkMsR0FBekIsQ0FBNkJDLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxPQUFSLEVBQXhDO0FBQ0QsS0F0Qm1FOztBQUFBLG9EQXdCM0MsTUFBTVAsT0FBTixJQUFpQjtBQUN4QyxZQUFNLEtBQUtDLEtBQUwsQ0FBV08sY0FBWCxDQUEwQlIsT0FBMUIsQ0FBTjtBQUNBLG1DQUFTLHVCQUFULEVBQWtDO0FBQUNHLFFBQUFBLE9BQU8sRUFBRTtBQUFWLE9BQWxDO0FBQ0EsV0FBS0YsS0FBTCxDQUFXRyxhQUFYLENBQXlCQyxHQUF6QixDQUE2QkMsT0FBTyxJQUFJQSxPQUFPLENBQUNDLE9BQVIsRUFBeEM7QUFDRCxLQTVCbUU7QUFBQTs7QUFRcEVFLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQ0UsNkJBQUMsMkJBQUQ7QUFDRSxNQUFBLG1CQUFtQixFQUFFLEtBQUtDLG1CQUQ1QjtBQUVFLE1BQUEsc0JBQXNCLEVBQUUsS0FBS0M7QUFGL0IsT0FHTSxLQUFLVixLQUhYLEVBREY7QUFPRDs7QUFoQm1FOzs7O2dCQUFqREosd0IsZUFDQTtBQUNqQkssRUFBQUEsV0FBVyxFQUFFVSxtQkFBVUMsSUFBVixDQUFlQyxVQURYO0FBRWpCTixFQUFBQSxjQUFjLEVBQUVJLG1CQUFVQyxJQUFWLENBQWVDLFVBRmQ7QUFJakJWLEVBQUFBLGFBQWEsRUFBRVcsOEJBQWtCRDtBQUpoQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBSZWFjdGlvblBpY2tlclZpZXcgZnJvbSAnLi4vdmlld3MvcmVhY3Rpb24tcGlja2VyLXZpZXcnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0aW9uUGlja2VyQ29udHJvbGxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgYWRkUmVhY3Rpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVtb3ZlUmVhY3Rpb246IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICB0b29sdGlwSG9sZGVyOiBSZWZIb2xkZXJQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UmVhY3Rpb25QaWNrZXJWaWV3XG4gICAgICAgIGFkZFJlYWN0aW9uQW5kQ2xvc2U9e3RoaXMuYWRkUmVhY3Rpb25BbmRDbG9zZX1cbiAgICAgICAgcmVtb3ZlUmVhY3Rpb25BbmRDbG9zZT17dGhpcy5yZW1vdmVSZWFjdGlvbkFuZENsb3NlfVxuICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIGFkZFJlYWN0aW9uQW5kQ2xvc2UgPSBhc3luYyBjb250ZW50ID0+IHtcbiAgICBhd2FpdCB0aGlzLnByb3BzLmFkZFJlYWN0aW9uKGNvbnRlbnQpO1xuICAgIGFkZEV2ZW50KCdhZGQtZW1vamktcmVhY3Rpb24nLCB7cGFja2FnZTogJ2dpdGh1Yid9KTtcbiAgICB0aGlzLnByb3BzLnRvb2x0aXBIb2xkZXIubWFwKHRvb2x0aXAgPT4gdG9vbHRpcC5kaXNwb3NlKCkpO1xuICB9XG5cbiAgcmVtb3ZlUmVhY3Rpb25BbmRDbG9zZSA9IGFzeW5jIGNvbnRlbnQgPT4ge1xuICAgIGF3YWl0IHRoaXMucHJvcHMucmVtb3ZlUmVhY3Rpb24oY29udGVudCk7XG4gICAgYWRkRXZlbnQoJ3JlbW92ZS1lbW9qaS1yZWFjdGlvbicsIHtwYWNrYWdlOiAnZ2l0aHViJ30pO1xuICAgIHRoaXMucHJvcHMudG9vbHRpcEhvbGRlci5tYXAodG9vbHRpcCA9PiB0b29sdGlwLmRpc3Bvc2UoKSk7XG4gIH1cbn1cbiJdfQ==