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
    return /*#__PURE__*/_react.default.createElement(Type, _extends({}, others, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy90aW1lYWdvLmpzIl0sIm5hbWVzIjpbIm1vbWVudCIsImRlZmluZUxvY2FsZSIsInBhcmVudExvY2FsZSIsInJlbGF0aXZlVGltZSIsImZ1dHVyZSIsInBhc3QiLCJzIiwic3MiLCJtIiwibW0iLCJoIiwiaGgiLCJkIiwiZGQiLCJNIiwiTU0iLCJ5IiwieXkiLCJsb2NhbGUiLCJUaW1lYWdvIiwiUmVhY3QiLCJDb21wb25lbnQiLCJnZXRUaW1lRGlzcGxheSIsInRpbWUiLCJub3ciLCJzdHlsZSIsImZyb20iLCJkaWZmIiwiTWF0aCIsImFicyIsImZvcm1hdCIsImNvbXBvbmVudERpZE1vdW50IiwidGltZXIiLCJzZXRJbnRlcnZhbCIsImZvcmNlVXBkYXRlIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJjbGVhckludGVydmFsIiwicmVuZGVyIiwicHJvcHMiLCJ0eXBlIiwiZGlzcGxheVN0eWxlIiwib3RoZXJzIiwiZGlzcGxheSIsIlR5cGUiLCJjbGFzc05hbWUiLCJQcm9wVHlwZXMiLCJhbnkiLCJpc1JlcXVpcmVkIiwib25lT2ZUeXBlIiwic3RyaW5nIiwiZnVuYyIsIm9uZU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBQSxnQkFBT0MsWUFBUCxDQUFvQixjQUFwQixFQUFvQztBQUNsQ0MsRUFBQUEsWUFBWSxFQUFFLElBRG9CO0FBRWxDQyxFQUFBQSxZQUFZLEVBQUU7QUFDWkMsSUFBQUEsTUFBTSxFQUFFLE9BREk7QUFFWkMsSUFBQUEsSUFBSSxFQUFFLFFBRk07QUFHWkMsSUFBQUEsQ0FBQyxFQUFFLEtBSFM7QUFJWkMsSUFBQUEsRUFBRSxFQUFFLEtBSlE7QUFLWkMsSUFBQUEsQ0FBQyxFQUFFLElBTFM7QUFNWkMsSUFBQUEsRUFBRSxFQUFFLEtBTlE7QUFPWkMsSUFBQUEsQ0FBQyxFQUFFLElBUFM7QUFRWkMsSUFBQUEsRUFBRSxFQUFFLEtBUlE7QUFTWkMsSUFBQUEsQ0FBQyxFQUFFLElBVFM7QUFVWkMsSUFBQUEsRUFBRSxFQUFFLEtBVlE7QUFXWkMsSUFBQUEsQ0FBQyxFQUFFLElBWFM7QUFZWkMsSUFBQUEsRUFBRSxFQUFFLEtBWlE7QUFhWkMsSUFBQUEsQ0FBQyxFQUFFLElBYlM7QUFjWkMsSUFBQUEsRUFBRSxFQUFFO0FBZFE7QUFGb0IsQ0FBcEM7O0FBbUJBakIsZ0JBQU9rQixNQUFQLENBQWMsSUFBZDs7QUFFZSxNQUFNQyxPQUFOLFNBQXNCQyxlQUFNQyxTQUE1QixDQUFzQztBQWU5QixTQUFkQyxjQUFjLENBQUNDLElBQUQsRUFBT0MsR0FBUCxFQUFZQyxLQUFaLEVBQW1CO0FBQ3RDLFVBQU1qQixDQUFDLEdBQUcscUJBQU9lLElBQVAsQ0FBVjs7QUFDQSxRQUFJRSxLQUFLLEtBQUssT0FBZCxFQUF1QjtBQUNyQmpCLE1BQUFBLENBQUMsQ0FBQ1UsTUFBRixDQUFTLGNBQVQ7QUFDQSxhQUFPVixDQUFDLENBQUNrQixJQUFGLENBQU9GLEdBQVAsRUFBWSxJQUFaLENBQVA7QUFDRCxLQUhELE1BR087QUFDTCxZQUFNRyxJQUFJLEdBQUduQixDQUFDLENBQUNtQixJQUFGLENBQU9ILEdBQVAsRUFBWSxRQUFaLEVBQXNCLElBQXRCLENBQWI7O0FBQ0EsVUFBSUksSUFBSSxDQUFDQyxHQUFMLENBQVNGLElBQVQsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkJuQixRQUFBQSxDQUFDLENBQUNVLE1BQUYsQ0FBUyxJQUFUO0FBQ0EsZUFBT1YsQ0FBQyxDQUFDa0IsSUFBRixDQUFPRixHQUFQLENBQVA7QUFDRCxPQUhELE1BR087QUFDTCxjQUFNTSxNQUFNLEdBQUd0QixDQUFDLENBQUNzQixNQUFGLENBQVMsY0FBVCxDQUFmO0FBQ0EsZUFBUSxNQUFLQSxNQUFPLEVBQXBCO0FBQ0Q7QUFDRjtBQUNGOztBQUVEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLQyxLQUFMLEdBQWFDLFdBQVcsQ0FBQyxNQUFNLEtBQUtDLFdBQUwsRUFBUCxFQUEyQixLQUEzQixDQUF4QjtBQUNEOztBQUVEQyxFQUFBQSxvQkFBb0IsR0FBRztBQUNyQkMsSUFBQUEsYUFBYSxDQUFDLEtBQUtKLEtBQU4sQ0FBYjtBQUNEOztBQUVESyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFBOEMsS0FBS0MsS0FBbkQ7QUFBQSxVQUFNO0FBQUNDLE1BQUFBLElBQUQ7QUFBT2hCLE1BQUFBLElBQVA7QUFBYWlCLE1BQUFBO0FBQWIsS0FBTjtBQUFBLFVBQW9DQyxNQUFwQzs7QUFDQSxVQUFNQyxPQUFPLEdBQUd2QixPQUFPLENBQUNHLGNBQVIsQ0FBdUJDLElBQXZCLEVBQTZCLHNCQUE3QixFQUF1Q2lCLFlBQXZDLENBQWhCO0FBQ0EsVUFBTUcsSUFBSSxHQUFHSixJQUFiO0FBQ0EsVUFBTUssU0FBUyxHQUFHLHlCQUFHLFNBQUgsRUFBY0gsTUFBTSxDQUFDRyxTQUFyQixDQUFsQjtBQUNBLHdCQUNFLDZCQUFDLElBQUQsZUFBVUgsTUFBVjtBQUFrQixNQUFBLFNBQVMsRUFBRUc7QUFBN0IsUUFBeUNGLE9BQXpDLENBREY7QUFHRDs7QUFoRGtEOzs7O2dCQUFoQ3ZCLE8sZUFDQTtBQUNqQkksRUFBQUEsSUFBSSxFQUFFc0IsbUJBQVVDLEdBQVYsQ0FBY0MsVUFESDtBQUVqQlIsRUFBQUEsSUFBSSxFQUFFTSxtQkFBVUcsU0FBVixDQUFvQixDQUN4QkgsbUJBQVVJLE1BRGMsRUFFeEJKLG1CQUFVSyxJQUZjLENBQXBCLENBRlc7QUFNakJWLEVBQUFBLFlBQVksRUFBRUssbUJBQVVNLEtBQVYsQ0FBZ0IsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFoQjtBQU5HLEM7O2dCQURBaEMsTyxrQkFVRztBQUNwQm9CLEVBQUFBLElBQUksRUFBRSxNQURjO0FBRXBCQyxFQUFBQSxZQUFZLEVBQUU7QUFGTSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbm1vbWVudC5kZWZpbmVMb2NhbGUoJ2VuLXNob3J0ZGlmZicsIHtcbiAgcGFyZW50TG9jYWxlOiAnZW4nLFxuICByZWxhdGl2ZVRpbWU6IHtcbiAgICBmdXR1cmU6ICdpbiAlcycsXG4gICAgcGFzdDogJyVzIGFnbycsXG4gICAgczogJ05vdycsXG4gICAgc3M6ICc8MW0nLFxuICAgIG06ICcxbScsXG4gICAgbW06ICclZG0nLFxuICAgIGg6ICcxaCcsXG4gICAgaGg6ICclZGgnLFxuICAgIGQ6ICcxZCcsXG4gICAgZGQ6ICclZGQnLFxuICAgIE06ICcxTScsXG4gICAgTU06ICclZE0nLFxuICAgIHk6ICcxeScsXG4gICAgeXk6ICclZHknLFxuICB9LFxufSk7XG5tb21lbnQubG9jYWxlKCdlbicpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lYWdvIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0aW1lOiBQcm9wVHlwZXMuYW55LmlzUmVxdWlyZWQsXG4gICAgdHlwZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgUHJvcFR5cGVzLmZ1bmMsXG4gICAgXSksXG4gICAgZGlzcGxheVN0eWxlOiBQcm9wVHlwZXMub25lT2YoWydzaG9ydCcsICdsb25nJ10pLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0eXBlOiAnc3BhbicsXG4gICAgZGlzcGxheVN0eWxlOiAnbG9uZycsXG4gIH1cblxuICBzdGF0aWMgZ2V0VGltZURpc3BsYXkodGltZSwgbm93LCBzdHlsZSkge1xuICAgIGNvbnN0IG0gPSBtb21lbnQodGltZSk7XG4gICAgaWYgKHN0eWxlID09PSAnc2hvcnQnKSB7XG4gICAgICBtLmxvY2FsZSgnZW4tc2hvcnRkaWZmJyk7XG4gICAgICByZXR1cm4gbS5mcm9tKG5vdywgdHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRpZmYgPSBtLmRpZmYobm93LCAnbW9udGhzJywgdHJ1ZSk7XG4gICAgICBpZiAoTWF0aC5hYnMoZGlmZikgPD0gMSkge1xuICAgICAgICBtLmxvY2FsZSgnZW4nKTtcbiAgICAgICAgcmV0dXJuIG0uZnJvbShub3cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gbS5mb3JtYXQoJ01NTSBEbywgWVlZWScpO1xuICAgICAgICByZXR1cm4gYG9uICR7Zm9ybWF0fWA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKCgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSwgNjAwMDApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7dHlwZSwgdGltZSwgZGlzcGxheVN0eWxlLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBkaXNwbGF5ID0gVGltZWFnby5nZXRUaW1lRGlzcGxheSh0aW1lLCBtb21lbnQoKSwgZGlzcGxheVN0eWxlKTtcbiAgICBjb25zdCBUeXBlID0gdHlwZTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBjeCgndGltZWFnbycsIG90aGVycy5jbGFzc05hbWUpO1xuICAgIHJldHVybiAoXG4gICAgICA8VHlwZSB7Li4ub3RoZXJzfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2Rpc3BsYXl9PC9UeXBlPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==