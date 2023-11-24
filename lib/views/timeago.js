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