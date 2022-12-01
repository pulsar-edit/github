"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moment = _interopRequireDefault(require("moment"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_moment.default.defineLocale('en-shortdiff', {
  parentLocale: 'en',
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Now',
    ss: '<1m',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%dy'
  }
});

_moment.default.locale('en');

class Timeago extends _react.default.Component {
  static getTimeDisplay(time, now, style) {
    const m = (0, _moment.default)(time);

    if (style === 'short') {
      m.locale('en-shortdiff');
      return m.from(now, true);
    } else {
      const diff = m.diff(now, 'months', true);

      if (Math.abs(diff) <= 1) {
        m.locale('en');
        return m.from(now);
      } else {
        const format = m.format('MMM Do, YYYY');
        return `on ${format}`;
      }
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.forceUpdate(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const _this$props = this.props,
          {
      type,
      time,
      displayStyle
    } = _this$props,
          others = _objectWithoutProperties(_this$props, ["type", "time", "displayStyle"]);

    const display = Timeago.getTimeDisplay(time, (0, _moment.default)(), displayStyle);
    const Type = type;
    const className = (0, _classnames.default)('timeago', others.className);
    return _react.default.createElement(Type, _extends({}, others, {
      className: className
    }), display);
  }

}

exports.default = Timeago;

_defineProperty(Timeago, "propTypes", {
  time: _propTypes.default.any.isRequired,
  type: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  displayStyle: _propTypes.default.oneOf(['short', 'long'])
});

_defineProperty(Timeago, "defaultProps", {
  type: 'span',
  displayStyle: 'long'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy90aW1lYWdvLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsImRlZmluZUxvY2FsZSIsInBhcmVudExvY2FsZSIsInJlbGF0aXZlVGltZSIsImZ1dHVyZSIsInBhc3QiLCJzIiwic3MiLCJtIiwibW0iLCJoIiwiaGgiLCJkIiwiZGQiLCJNIiwiTU0iLCJ5IiwieXkiLCJsb2NhbGUiLCJUaW1lYWdvIiwiUmVhY3QiLCJDb21wb25lbnQiLCJnZXRUaW1lRGlzcGxheSIsInRpbWUiLCJub3ciLCJzdHlsZSIsImZyb20iLCJkaWZmIiwiTWF0aCIsImFicyIsImZvcm1hdCIsImNvbXBvbmVudERpZE1vdW50IiwidGltZXIiLCJzZXRJbnRlcnZhbCIsImZvcmNlVXBkYXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJjbGVhckludGVydmFsIiwicmVuZGVyIiwicHJvcHMiLCJ0eXBlIiwiZGlzcGxheVN0eWxlIiwib3RoZXJzIiwiZGlzcGxheSIsIlR5cGUiLCJjbGFzc05hbWUiLCJQcm9wVHlwZXMiLCJhbnkiLCJpc1JlcXVpcmVkIiwib25lT2ZUeXBlIiwic3RyaW5nIiwiZnVuYyIsIm9uZU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBQSxnQkFBT0MsWUFBUCxDQUFvQixjQUFwQixFQUFvQztBQUNsQ0MsRUFBQUEsWUFBWSxFQUFFLElBRG9CO0FBRWxDQyxFQUFBQSxZQUFZLEVBQUU7QUFDWkMsSUFBQUEsTUFBTSxFQUFFLE9BREk7QUFFWkMsSUFBQUEsSUFBSSxFQUFFLFFBRk07QUFHWkMsSUFBQUEsQ0FBQyxFQUFFLEtBSFM7QUFJWkMsSUFBQUEsRUFBRSxFQUFFLEtBSlE7QUFLWkMsSUFBQUEsQ0FBQyxFQUFFLElBTFM7QUFNWkMsSUFBQUEsRUFBRSxFQUFFLEtBTlE7QUFPWkMsSUFBQUEsQ0FBQyxFQUFFLElBUFM7QUFRWkMsSUFBQUEsRUFBRSxFQUFFLEtBUlE7QUFTWkMsSUFBQUEsQ0FBQyxFQUFFLElBVFM7QUFVWkMsSUFBQUEsRUFBRSxFQUFFLEtBVlE7QUFXWkMsSUFBQUEsQ0FBQyxFQUFFLElBWFM7QUFZWkMsSUFBQUEsRUFBRSxFQUFFLEtBWlE7QUFhWkMsSUFBQUEsQ0FBQyxFQUFFLElBYlM7QUFjWkMsSUFBQUEsRUFBRSxFQUFFO0FBZFE7QUFGb0IsQ0FBcEM7O0FBbUJBakIsZ0JBQU9rQixNQUFQLENBQWMsSUFBZDs7QUFFZSxNQUFNQyxPQUFOLFNBQXNCQyxlQUFNQyxTQUE1QixDQUFzQztBQWU5QixTQUFkQyxjQUFjLENBQUNDLElBQUQsRUFBT0MsR0FBUCxFQUFZQyxLQUFaLEVBQW1CO0FBQ3RDLFVBQU1qQixDQUFDLEdBQUcscUJBQU9lLElBQVAsQ0FBVjs7QUFDQSxRQUFJRSxLQUFLLEtBQUssT0FBZCxFQUF1QjtBQUNyQmpCLE1BQUFBLENBQUMsQ0FBQ1UsTUFBRixDQUFTLGNBQVQ7QUFDQSxhQUFPVixDQUFDLENBQUNrQixJQUFGLENBQU9GLEdBQVAsRUFBWSxJQUFaLENBQVA7QUFDRCxLQUhELE1BR087QUFDTCxZQUFNRyxJQUFJLEdBQUduQixDQUFDLENBQUNtQixJQUFGLENBQU9ILEdBQVAsRUFBWSxRQUFaLEVBQXNCLElBQXRCLENBQWI7O0FBQ0EsVUFBSUksSUFBSSxDQUFDQyxHQUFMLENBQVNGLElBQVQsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkJuQixRQUFBQSxDQUFDLENBQUNVLE1BQUYsQ0FBUyxJQUFUO0FBQ0EsZUFBT1YsQ0FBQyxDQUFDa0IsSUFBRixDQUFPRixHQUFQLENBQVA7QUFDRCxPQUhELE1BR087QUFDTCxjQUFNTSxNQUFNLEdBQUd0QixDQUFDLENBQUNzQixNQUFGLENBQVMsY0FBVCxDQUFmO0FBQ0EsZUFBUSxNQUFLQSxNQUFPLEVBQXBCO0FBQ0Q7QUFDRjtBQUNGOztBQUVEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLQyxLQUFMLEdBQWFDLFdBQVcsQ0FBQyxNQUFNLEtBQUtDLFdBQUwsRUFBUCxFQUEyQixLQUEzQixDQUF4QjtBQUNEOztBQUVEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQkMsSUFBQUEsYUFBYSxDQUFDLEtBQUtKLEtBQU4sQ0FBYjtBQUNEOztBQUVESyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFBOEMsS0FBS0MsS0FBbkQ7QUFBQSxVQUFNO0FBQUNDLE1BQUFBLElBQUQ7QUFBT2hCLE1BQUFBLElBQVA7QUFBYWlCLE1BQUFBO0FBQWIsS0FBTjtBQUFBLFVBQW9DQyxNQUFwQzs7QUFDQSxVQUFNQyxPQUFPLEdBQUd2QixPQUFPLENBQUNHLGNBQVIsQ0FBdUJDLElBQXZCLEVBQTZCLHNCQUE3QixFQUF1Q2lCLFlBQXZDLENBQWhCO0FBQ0EsVUFBTUcsSUFBSSxHQUFHSixJQUFiO0FBQ0EsVUFBTUssU0FBUyxHQUFHLHlCQUFHLFNBQUgsRUFBY0gsTUFBTSxDQUFDRyxTQUFyQixDQUFsQjtBQUNBLFdBQ0UsNkJBQUMsSUFBRCxlQUFVSCxNQUFWO0FBQWtCLE1BQUEsU0FBUyxFQUFFRztBQUE3QixRQUF5Q0YsT0FBekMsQ0FERjtBQUdEOztBQWhEa0Q7Ozs7Z0JBQWhDdkIsTyxlQUNBO0FBQ2pCSSxFQUFBQSxJQUFJLEVBQUVzQixtQkFBVUMsR0FBVixDQUFjQyxVQURIO0FBRWpCUixFQUFBQSxJQUFJLEVBQUVNLG1CQUFVRyxTQUFWLENBQW9CLENBQ3hCSCxtQkFBVUksTUFEYyxFQUV4QkosbUJBQVVLLElBRmMsQ0FBcEIsQ0FGVztBQU1qQlYsRUFBQUEsWUFBWSxFQUFFSyxtQkFBVU0sS0FBVixDQUFnQixDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWhCO0FBTkcsQzs7Z0JBREFoQyxPLGtCQVVHO0FBQ3BCb0IsRUFBQUEsSUFBSSxFQUFFLE1BRGM7QUFFcEJDLEVBQUFBLFlBQVksRUFBRTtBQUZNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxubW9tZW50LmRlZmluZUxvY2FsZSgnZW4tc2hvcnRkaWZmJywge1xuICBwYXJlbnRMb2NhbGU6ICdlbicsXG4gIHJlbGF0aXZlVGltZToge1xuICAgIGZ1dHVyZTogJ2luICVzJyxcbiAgICBwYXN0OiAnJXMgYWdvJyxcbiAgICBzOiAnTm93JyxcbiAgICBzczogJzwxbScsXG4gICAgbTogJzFtJyxcbiAgICBtbTogJyVkbScsXG4gICAgaDogJzFoJyxcbiAgICBoaDogJyVkaCcsXG4gICAgZDogJzFkJyxcbiAgICBkZDogJyVkZCcsXG4gICAgTTogJzFNJyxcbiAgICBNTTogJyVkTScsXG4gICAgeTogJzF5JyxcbiAgICB5eTogJyVkeScsXG4gIH0sXG59KTtcbm1vbWVudC5sb2NhbGUoJ2VuJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVhZ28gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpbWU6IFByb3BUeXBlcy5hbnkuaXNSZXF1aXJlZCxcbiAgICB0eXBlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBQcm9wVHlwZXMuZnVuYyxcbiAgICBdKSxcbiAgICBkaXNwbGF5U3R5bGU6IFByb3BUeXBlcy5vbmVPZihbJ3Nob3J0JywgJ2xvbmcnXSksXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHR5cGU6ICdzcGFuJyxcbiAgICBkaXNwbGF5U3R5bGU6ICdsb25nJyxcbiAgfVxuXG4gIHN0YXRpYyBnZXRUaW1lRGlzcGxheSh0aW1lLCBub3csIHN0eWxlKSB7XG4gICAgY29uc3QgbSA9IG1vbWVudCh0aW1lKTtcbiAgICBpZiAoc3R5bGUgPT09ICdzaG9ydCcpIHtcbiAgICAgIG0ubG9jYWxlKCdlbi1zaG9ydGRpZmYnKTtcbiAgICAgIHJldHVybiBtLmZyb20obm93LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGlmZiA9IG0uZGlmZihub3csICdtb250aHMnLCB0cnVlKTtcbiAgICAgIGlmIChNYXRoLmFicyhkaWZmKSA8PSAxKSB7XG4gICAgICAgIG0ubG9jYWxlKCdlbicpO1xuICAgICAgICByZXR1cm4gbS5mcm9tKG5vdyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmb3JtYXQgPSBtLmZvcm1hdCgnTU1NIERvLCBZWVlZJyk7XG4gICAgICAgIHJldHVybiBgb24gJHtmb3JtYXR9YDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpLCA2MDAwMCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHt0eXBlLCB0aW1lLCBkaXNwbGF5U3R5bGUsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGRpc3BsYXkgPSBUaW1lYWdvLmdldFRpbWVEaXNwbGF5KHRpbWUsIG1vbWVudCgpLCBkaXNwbGF5U3R5bGUpO1xuICAgIGNvbnN0IFR5cGUgPSB0eXBlO1xuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGN4KCd0aW1lYWdvJywgb3RoZXJzLmNsYXNzTmFtZSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUeXBlIHsuLi5vdGhlcnN9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57ZGlzcGxheX08L1R5cGU+XG4gICAgKTtcbiAgfVxufVxuIl19