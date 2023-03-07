"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _atom = require("atom");
var _eventKit = require("event-kit");
var _electron = require("electron");
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _lodash = _interopRequireDefault(require("lodash.memoize"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const {
  dialog
} = _electron.remote;
const genArray = (0, _lodash.default)(function genArray(interval, count) {
  const arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push(interval * i);
  }
  return arr;
}, (interval, count) => `${interval}:${count}`);
class Marker {
  static deserialize(data) {
    const marker = new Marker(data.label, () => {});
    marker.end = data.end;
    marker.markers = data.markers;
    return marker;
  }
  constructor(label, didUpdate) {
    this.label = label;
    this.didUpdate = didUpdate;
    this.end = null;
    this.markers = [];
  }
  getStart() {
    return this.markers.length ? this.markers[0].start : null;
  }
  getEnd() {
    return this.end;
  }
  mark(sectionName, start) {
    this.markers.push({
      name: sectionName,
      start: start || performance.now()
    });
  }
  finalize() {
    this.end = performance.now();
    this.didUpdate();
  }
  getTimings() {
    return this.markers.map((timing, idx, ary) => {
      const next = ary[idx + 1];
      const end = next ? next.start : this.getEnd();
      return _objectSpread({}, timing, {
        end
      });
    });
  }
  serialize() {
    return {
      label: this.label,
      end: this.end,
      markers: this.markers.slice()
    };
  }
}
class MarkerTooltip extends _react.default.Component {
  render() {
    const {
      marker
    } = this.props;
    const timings = marker.getTimings();
    return _react.default.createElement("div", {
      style: {
        textAlign: 'left',
        maxWidth: 300,
        whiteSpace: 'initial'
      }
    }, _react.default.createElement("strong", null, _react.default.createElement("tt", null, marker.label)), _react.default.createElement("ul", {
      style: {
        paddingLeft: 20,
        marginTop: 10
      }
    }, timings.map(({
      name,
      start,
      end
    }) => {
      const duration = end - start;
      return _react.default.createElement("li", {
        key: name
      }, name, ": ", Math.floor(duration * 100) / 100, "ms");
    })));
  }
}
_defineProperty(MarkerTooltip, "propTypes", {
  marker: _propTypes.default.instanceOf(Marker).isRequired
});
const COLORS = {
  queued: 'red',
  prepare: 'cyan',
  nexttick: 'yellow',
  execute: 'green',
  ipc: 'pink'
};
class MarkerSpan extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleMouseOver', 'handleMouseOut');
  }
  render() {
    const _this$props = this.props,
      {
        marker
      } = _this$props,
      others = _objectWithoutProperties(_this$props, ["marker"]);
    const timings = marker.getTimings();
    const totalTime = marker.getEnd() - marker.getStart();
    const percentages = timings.map(({
      name,
      start,
      end
    }) => {
      const duration = end - start;
      return {
        color: COLORS[name],
        percent: duration / totalTime * 100
      };
    });
    return _react.default.createElement("span", _extends({}, others, {
      ref: c => {
        this.element = c;
      },
      onMouseOver: this.handleMouseOver,
      onMouseOut: this.handleMouseOut
    }), percentages.map(({
      color,
      percent
    }, i) => {
      const style = {
        width: `${percent}%`,
        background: color
      };
      return _react.default.createElement("span", {
        className: "waterfall-marker-section",
        key: i,
        style: style
      });
    }));
  }
  handleMouseOver(e) {
    const elem = document.createElement('div');
    _reactDom.default.render(_react.default.createElement(MarkerTooltip, {
      marker: this.props.marker
    }), elem);
    this.tooltipDisposable = atom.tooltips.add(this.element, {
      item: elem,
      placement: 'auto bottom',
      trigger: 'manual'
    });
  }
  closeTooltip() {
    this.tooltipDisposable && this.tooltipDisposable.dispose();
    this.tooltipDisposable = null;
  }
  handleMouseOut(e) {
    this.closeTooltip();
  }
  componentWillUnmount() {
    this.closeTooltip();
  }
}
_defineProperty(MarkerSpan, "propTypes", {
  marker: _propTypes.default.instanceOf(Marker).isRequired
});
class Waterfall extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'renderMarker');
    this.state = this.getNextState(props);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.getNextState(nextProps));
  }
  getNextState(props) {
    const {
      markers
    } = props;
    const firstMarker = markers[0];
    const lastMarker = markers[markers.length - 1];
    const startTime = firstMarker.getStart();
    const endTime = lastMarker.getEnd();
    const totalDuration = endTime - startTime;
    let timelineMarkInterval = null;
    if (props.zoomFactor <= 0.15) {
      timelineMarkInterval = 1000;
    } else if (props.zoomFactor <= 0.3) {
      timelineMarkInterval = 500;
    } else if (props.zoomFactor <= 0.6) {
      timelineMarkInterval = 250;
    } else {
      timelineMarkInterval = 100;
    }
    const timelineMarks = genArray(timelineMarkInterval, Math.ceil(totalDuration / timelineMarkInterval));
    return {
      firstMarker,
      lastMarker,
      startTime,
      endTime,
      totalDuration,
      timelineMarks
    };
  }
  render() {
    return _react.default.createElement("div", {
      className: "waterfall-scroller"
    }, _react.default.createElement("div", {
      className: "waterfall-container"
    }, this.renderTimeMarkers(), this.renderTimeline(), this.props.markers.map(this.renderMarker)));
  }
  renderTimeline() {
    return _react.default.createElement("div", {
      className: "waterfall-timeline"
    }, "\xA0", this.state.timelineMarks.map(time => {
      const leftPos = time * this.props.zoomFactor;
      const style = {
        left: leftPos
      };
      return _react.default.createElement("span", {
        className: "waterfall-timeline-label",
        style: style,
        key: `tl:${time}`
      }, time, "ms");
    }));
  }
  renderTimeMarkers() {
    return _react.default.createElement("div", {
      className: "waterfall-time-markers"
    }, this.state.timelineMarks.map(time => {
      const leftPos = time * this.props.zoomFactor;
      const style = {
        left: leftPos
      };
      return _react.default.createElement("span", {
        className: "waterfall-time-marker",
        style: style,
        key: `tm:${time}`
      });
    }));
  }
  renderMarker(marker, i) {
    if (marker.getStart() === null || marker.getEnd() === null) {
      return _react.default.createElement("div", {
        key: i
      });
    }
    const startOffset = marker.getStart() - this.state.startTime;
    const duration = marker.getEnd() - marker.getStart();
    const markerStyle = {
      left: startOffset * this.props.zoomFactor,
      width: duration * this.props.zoomFactor
    };
    return _react.default.createElement("div", {
      className: "waterfall-row",
      key: i
    }, _react.default.createElement("span", {
      className: "waterfall-row-label",
      style: {
        paddingLeft: markerStyle.left + markerStyle.width
      }
    }, marker.label), _react.default.createElement(MarkerSpan, {
      className: "waterfall-marker",
      style: markerStyle,
      marker: marker
    }));
  }
}
_defineProperty(Waterfall, "propTypes", {
  markers: _propTypes.default.arrayOf(_propTypes.default.instanceOf(Marker)).isRequired,
  zoomFactor: _propTypes.default.number.isRequired
});
class WaterfallWidget extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'handleZoomFactorChange', 'handleCollapseClick', 'handleExportClick');
    this.state = {
      zoomFactor: 0.3,
      collapsed: false
    };
  }
  render() {
    const {
      markers
    } = this.props;
    const firstMarker = markers[0];
    const lastMarker = markers[markers.length - 1];
    const startTime = firstMarker.getStart();
    const endTime = lastMarker.getEnd();
    const duration = endTime - startTime;
    return _react.default.createElement("div", {
      className: "waterfall-widget inset-pannel"
    }, _react.default.createElement("div", {
      className: "waterfall-header"
    }, _react.default.createElement("div", {
      className: "waterfall-header-text"
    }, _react.default.createElement("span", {
      onClick: this.handleCollapseClick,
      className: "collapse-toggle"
    }, this.state.collapsed ? '\u25b6' : '\u25bc'), this.props.markers.length, " event(s) over ", Math.floor(duration), "ms"), _react.default.createElement("div", {
      className: "waterfall-header-controls"
    }, _react.default.createElement("button", {
      className: "waterfall-export-button btn btn-sm",
      onClick: this.handleExportClick
    }, "Export"), _react.default.createElement(_octicon.default, {
      icon: "search"
    }), _react.default.createElement("input", {
      type: "range",
      className: "input-range",
      min: 0.1,
      max: 1,
      step: 0.01,
      value: this.state.zoomFactor,
      onChange: this.handleZoomFactorChange
    }))), this.state.collapsed ? null : _react.default.createElement(Waterfall, {
      markers: this.props.markers,
      zoomFactor: this.state.zoomFactor
    }));
  }
  handleZoomFactorChange(e) {
    this.setState({
      zoomFactor: parseFloat(e.target.value)
    });
  }
  handleCollapseClick(e) {
    this.setState(s => ({
      collapsed: !s.collapsed
    }));
  }
  async handleExportClick(e) {
    e.preventDefault();
    const json = JSON.stringify(this.props.markers.map(m => m.serialize()), null, '  ');
    const buffer = new _atom.TextBuffer({
      text: json
    });
    const {
      filePath
    } = await dialog.showSaveDialog({
      defaultPath: 'git-timings.json'
    });
    if (!filePath) {
      return;
    }
    buffer.saveAs(filePath);
  }
}
_defineProperty(WaterfallWidget, "propTypes", {
  markers: _propTypes.default.arrayOf(_propTypes.default.instanceOf(Marker)).isRequired
});
let markers = null;
let groupId = 0;
const groups = [];
let lastMarkerTime = null;
let updateTimer = null;
class GitTimingsView extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }
  static generateMarker(label) {
    const marker = new Marker(label, () => {
      GitTimingsView.scheduleUpdate();
    });
    const now = performance.now();
    if (!markers || lastMarkerTime && Math.abs(now - lastMarkerTime) >= 5000) {
      groupId++;
      markers = [];
      groups.unshift({
        id: groupId,
        markers
      });
      if (groups.length > 100) {
        groups.pop();
      }
    }
    lastMarkerTime = now;
    markers.push(marker);
    GitTimingsView.scheduleUpdate();
    return marker;
  }
  static restoreGroup(group) {
    groupId++;
    groups.unshift({
      id: groupId,
      markers: group
    });
    GitTimingsView.scheduleUpdate(true);
  }
  static scheduleUpdate(immediate = false) {
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    updateTimer = setTimeout(() => {
      GitTimingsView.emitter.emit('did-update');
    }, immediate ? 0 : 1000);
  }
  static onDidUpdate(callback) {
    return GitTimingsView.emitter.on('did-update', callback);
  }
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleImportClick');
  }
  componentDidMount() {
    this.subscriptions = new _eventKit.CompositeDisposable(GitTimingsView.onDidUpdate(() => this.forceUpdate()));
  }
  componentWillUnmount() {
    this.subscriptions.dispose();
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-GitTimingsView"
    }, _react.default.createElement("div", {
      className: "github-GitTimingsView-header"
    }, _react.default.createElement("button", {
      className: "import-button btn",
      onClick: this.handleImportClick
    }, "Import")), groups.map((group, idx) => _react.default.createElement(WaterfallWidget, {
      key: group.id,
      markers: group.markers
    })));
  }
  async handleImportClick(e) {
    e.preventDefault();
    const {
      filePaths
    } = await dialog.showOpenDialog({
      properties: ['openFile']
    });
    if (!filePaths.length) {
      return;
    }
    const filename = filePaths[0];
    try {
      const contents = await _fsExtra.default.readFile(filename, {
        encoding: 'utf8'
      });
      const data = JSON.parse(contents);
      const restoredMarkers = data.map(item => Marker.deserialize(item));
      GitTimingsView.restoreGroup(restoredMarkers);
    } catch (_err) {
      atom.notifications.addError(`Could not import timings from ${filename}`);
    }
  }
  serialize() {
    return {
      deserializer: 'GitTimingsView'
    };
  }
  getURI() {
    return this.constructor.buildURI();
  }
  getTitle() {
    return 'GitHub Package Timings View';
  }
}
exports.default = GitTimingsView;
_defineProperty(GitTimingsView, "uriPattern", 'atom-github://debug/timings');
_defineProperty(GitTimingsView, "emitter", new _eventKit.Emitter());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfZXZlbnRLaXQiLCJfZWxlY3Ryb24iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3Byb3BUeXBlcyIsIl9sb2Rhc2giLCJfZnNFeHRyYSIsIl9vY3RpY29uIiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsImV4Y2x1ZGVkIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzb3VyY2VTeW1ib2xLZXlzIiwiaW5kZXhPZiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic291cmNlS2V5cyIsImtleXMiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsInB1c2giLCJfb2JqZWN0U3ByZWFkIiwiZm9yRWFjaCIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJkaWFsb2ciLCJyZW1vdGUiLCJnZW5BcnJheSIsIm1lbW9pemUiLCJpbnRlcnZhbCIsImNvdW50IiwiYXJyIiwiTWFya2VyIiwiZGVzZXJpYWxpemUiLCJkYXRhIiwibWFya2VyIiwibGFiZWwiLCJlbmQiLCJtYXJrZXJzIiwiY29uc3RydWN0b3IiLCJkaWRVcGRhdGUiLCJnZXRTdGFydCIsInN0YXJ0IiwiZ2V0RW5kIiwibWFyayIsInNlY3Rpb25OYW1lIiwibmFtZSIsInBlcmZvcm1hbmNlIiwibm93IiwiZmluYWxpemUiLCJnZXRUaW1pbmdzIiwibWFwIiwidGltaW5nIiwiaWR4IiwiYXJ5IiwibmV4dCIsInNlcmlhbGl6ZSIsInNsaWNlIiwiTWFya2VyVG9vbHRpcCIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJ0aW1pbmdzIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwidGV4dEFsaWduIiwibWF4V2lkdGgiLCJ3aGl0ZVNwYWNlIiwicGFkZGluZ0xlZnQiLCJtYXJnaW5Ub3AiLCJkdXJhdGlvbiIsIk1hdGgiLCJmbG9vciIsIlByb3BUeXBlcyIsImluc3RhbmNlT2YiLCJpc1JlcXVpcmVkIiwiQ09MT1JTIiwicXVldWVkIiwicHJlcGFyZSIsIm5leHR0aWNrIiwiZXhlY3V0ZSIsImlwYyIsIk1hcmtlclNwYW4iLCJhdXRvYmluZCIsIl90aGlzJHByb3BzIiwib3RoZXJzIiwidG90YWxUaW1lIiwicGVyY2VudGFnZXMiLCJjb2xvciIsInBlcmNlbnQiLCJyZWYiLCJjIiwiZWxlbWVudCIsIm9uTW91c2VPdmVyIiwiaGFuZGxlTW91c2VPdmVyIiwib25Nb3VzZU91dCIsImhhbmRsZU1vdXNlT3V0Iiwid2lkdGgiLCJiYWNrZ3JvdW5kIiwiY2xhc3NOYW1lIiwiZSIsImVsZW0iLCJkb2N1bWVudCIsIlJlYWN0RG9tIiwidG9vbHRpcERpc3Bvc2FibGUiLCJhdG9tIiwidG9vbHRpcHMiLCJhZGQiLCJpdGVtIiwicGxhY2VtZW50IiwidHJpZ2dlciIsImNsb3NlVG9vbHRpcCIsImRpc3Bvc2UiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIldhdGVyZmFsbCIsImNvbnRleHQiLCJzdGF0ZSIsImdldE5leHRTdGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJzZXRTdGF0ZSIsImZpcnN0TWFya2VyIiwibGFzdE1hcmtlciIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJ0b3RhbER1cmF0aW9uIiwidGltZWxpbmVNYXJrSW50ZXJ2YWwiLCJ6b29tRmFjdG9yIiwidGltZWxpbmVNYXJrcyIsImNlaWwiLCJyZW5kZXJUaW1lTWFya2VycyIsInJlbmRlclRpbWVsaW5lIiwicmVuZGVyTWFya2VyIiwidGltZSIsImxlZnRQb3MiLCJsZWZ0Iiwic3RhcnRPZmZzZXQiLCJtYXJrZXJTdHlsZSIsImFycmF5T2YiLCJudW1iZXIiLCJXYXRlcmZhbGxXaWRnZXQiLCJjb2xsYXBzZWQiLCJvbkNsaWNrIiwiaGFuZGxlQ29sbGFwc2VDbGljayIsImhhbmRsZUV4cG9ydENsaWNrIiwiaWNvbiIsInR5cGUiLCJtaW4iLCJtYXgiLCJzdGVwIiwib25DaGFuZ2UiLCJoYW5kbGVab29tRmFjdG9yQ2hhbmdlIiwicGFyc2VGbG9hdCIsInMiLCJwcmV2ZW50RGVmYXVsdCIsImpzb24iLCJKU09OIiwic3RyaW5naWZ5IiwibSIsImJ1ZmZlciIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwiZmlsZVBhdGgiLCJzaG93U2F2ZURpYWxvZyIsImRlZmF1bHRQYXRoIiwic2F2ZUFzIiwiZ3JvdXBJZCIsImdyb3VwcyIsImxhc3RNYXJrZXJUaW1lIiwidXBkYXRlVGltZXIiLCJHaXRUaW1pbmdzVmlldyIsImJ1aWxkVVJJIiwidXJpUGF0dGVybiIsImdlbmVyYXRlTWFya2VyIiwic2NoZWR1bGVVcGRhdGUiLCJhYnMiLCJ1bnNoaWZ0IiwiaWQiLCJwb3AiLCJyZXN0b3JlR3JvdXAiLCJncm91cCIsImltbWVkaWF0ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbWl0dGVyIiwiZW1pdCIsIm9uRGlkVXBkYXRlIiwiY2FsbGJhY2siLCJvbiIsImNvbXBvbmVudERpZE1vdW50Iiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJmb3JjZVVwZGF0ZSIsImhhbmRsZUltcG9ydENsaWNrIiwiZmlsZVBhdGhzIiwic2hvd09wZW5EaWFsb2ciLCJwcm9wZXJ0aWVzIiwiZmlsZW5hbWUiLCJjb250ZW50cyIsImZzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsInBhcnNlIiwicmVzdG9yZWRNYXJrZXJzIiwiX2VyciIsIm5vdGlmaWNhdGlvbnMiLCJhZGRFcnJvciIsImRlc2VyaWFsaXplciIsImdldFVSSSIsImdldFRpdGxlIiwiZXhwb3J0cyIsIkVtaXR0ZXIiXSwic291cmNlcyI6WyJnaXQtdGltaW5ncy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuY29uc3Qge2RpYWxvZ30gPSByZW1vdGU7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBnZW5BcnJheSA9IG1lbW9pemUoZnVuY3Rpb24gZ2VuQXJyYXkoaW50ZXJ2YWwsIGNvdW50KSB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSBjb3VudDsgaSsrKSB7XG4gICAgYXJyLnB1c2goaW50ZXJ2YWwgKiBpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufSwgKGludGVydmFsLCBjb3VudCkgPT4gYCR7aW50ZXJ2YWx9OiR7Y291bnR9YCk7XG5cbmNsYXNzIE1hcmtlciB7XG4gIHN0YXRpYyBkZXNlcmlhbGl6ZShkYXRhKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IE1hcmtlcihkYXRhLmxhYmVsLCAoKSA9PiB7fSk7XG4gICAgbWFya2VyLmVuZCA9IGRhdGEuZW5kO1xuICAgIG1hcmtlci5tYXJrZXJzID0gZGF0YS5tYXJrZXJzO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihsYWJlbCwgZGlkVXBkYXRlKSB7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMuZGlkVXBkYXRlID0gZGlkVXBkYXRlO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGdldFN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubGVuZ3RoID8gdGhpcy5tYXJrZXJzWzBdLnN0YXJ0IDogbnVsbDtcbiAgfVxuXG4gIGdldEVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH1cblxuICBtYXJrKHNlY3Rpb25OYW1lLCBzdGFydCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHtuYW1lOiBzZWN0aW9uTmFtZSwgc3RhcnQ6IHN0YXJ0IHx8IHBlcmZvcm1hbmNlLm5vdygpfSk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLmVuZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICBnZXRUaW1pbmdzKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubWFwKCh0aW1pbmcsIGlkeCwgYXJ5KSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gYXJ5W2lkeCArIDFdO1xuICAgICAgY29uc3QgZW5kID0gbmV4dCA/IG5leHQuc3RhcnQgOiB0aGlzLmdldEVuZCgpO1xuICAgICAgcmV0dXJuIHsuLi50aW1pbmcsIGVuZH07XG4gICAgfSk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgZW5kOiB0aGlzLmVuZCxcbiAgICAgIG1hcmtlcnM6IHRoaXMubWFya2Vycy5zbGljZSgpLFxuICAgIH07XG4gIH1cbn1cblxuXG5jbGFzcyBNYXJrZXJUb29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdGltaW5ncyA9IG1hcmtlci5nZXRUaW1pbmdzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjogJ2xlZnQnLCBtYXhXaWR0aDogMzAwLCB3aGl0ZVNwYWNlOiAnaW5pdGlhbCd9fT5cbiAgICAgICAgPHN0cm9uZz48dHQ+e21hcmtlci5sYWJlbH08L3R0Pjwvc3Ryb25nPlxuICAgICAgICA8dWwgc3R5bGU9e3twYWRkaW5nTGVmdDogMjAsIG1hcmdpblRvcDogMTB9fT5cbiAgICAgICAgICB7dGltaW5ncy5tYXAoKHtuYW1lLCBzdGFydCwgZW5kfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBlbmQgLSBzdGFydDtcbiAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtuYW1lfT57bmFtZX06IHtNYXRoLmZsb29yKGR1cmF0aW9uICogMTAwKSAvIDEwMH1tczwvbGk+O1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBDT0xPUlMgPSB7XG4gIHF1ZXVlZDogJ3JlZCcsXG4gIHByZXBhcmU6ICdjeWFuJyxcbiAgbmV4dHRpY2s6ICd5ZWxsb3cnLFxuICBleGVjdXRlOiAnZ3JlZW4nLFxuICBpcGM6ICdwaW5rJyxcbn07XG5jbGFzcyBNYXJrZXJTcGFuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVNb3VzZU92ZXInLCAnaGFuZGxlTW91c2VPdXQnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB0aW1pbmdzID0gbWFya2VyLmdldFRpbWluZ3MoKTtcbiAgICBjb25zdCB0b3RhbFRpbWUgPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBwZXJjZW50YWdlcyA9IHRpbWluZ3MubWFwKCh7bmFtZSwgc3RhcnQsIGVuZH0pID0+IHtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kIC0gc3RhcnQ7XG4gICAgICByZXR1cm4ge2NvbG9yOiBDT0xPUlNbbmFtZV0sIHBlcmNlbnQ6IGR1cmF0aW9uIC8gdG90YWxUaW1lICogMTAwfTtcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgey4uLm90aGVyc31cbiAgICAgICAgcmVmPXtjID0+IHsgdGhpcy5lbGVtZW50ID0gYzsgfX1cbiAgICAgICAgb25Nb3VzZU92ZXI9e3RoaXMuaGFuZGxlTW91c2VPdmVyfVxuICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAge3BlcmNlbnRhZ2VzLm1hcCgoe2NvbG9yLCBwZXJjZW50fSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgd2lkdGg6IGAke3BlcmNlbnR9JWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvcixcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtbWFya2VyLXNlY3Rpb25cIiBrZXk9e2l9IHN0eWxlPXtzdHlsZX0gLz47XG4gICAgICAgIH0pfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU92ZXIoZSkge1xuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBSZWFjdERvbS5yZW5kZXIoPE1hcmtlclRvb2x0aXAgbWFya2VyPXt0aGlzLnByb3BzLm1hcmtlcn0gLz4sIGVsZW0pO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIGl0ZW06IGVsZW0sXG4gICAgICBwbGFjZW1lbnQ6ICdhdXRvIGJvdHRvbScsXG4gICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlVG9vbHRpcCgpIHtcbiAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlICYmIHRoaXMudG9vbHRpcERpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQoZSkge1xuICAgIHRoaXMuY2xvc2VUb29sdGlwKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNsb3NlVG9vbHRpcCgpO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICAgIHpvb21GYWN0b3I6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJNYXJrZXInKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXROZXh0U3RhdGUocHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TmV4dFN0YXRlKG5leHRQcm9wcykpO1xuICB9XG5cbiAgZ2V0TmV4dFN0YXRlKHByb3BzKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gcHJvcHM7XG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSBtYXJrZXJzWzBdO1xuICAgIGNvbnN0IGxhc3RNYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV07XG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBmaXJzdE1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsYXN0TWFya2VyLmdldEVuZCgpO1xuICAgIGNvbnN0IHRvdGFsRHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIGxldCB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IG51bGw7XG4gICAgaWYgKHByb3BzLnpvb21GYWN0b3IgPD0gMC4xNSkge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSAxMDAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjMpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gNTAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjYpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gMjUwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDEwMDtcbiAgICB9XG4gICAgY29uc3QgdGltZWxpbmVNYXJrcyA9IGdlbkFycmF5KHRpbWVsaW5lTWFya0ludGVydmFsLCBNYXRoLmNlaWwodG90YWxEdXJhdGlvbiAvIHRpbWVsaW5lTWFya0ludGVydmFsKSk7XG5cbiAgICByZXR1cm4ge2ZpcnN0TWFya2VyLCBsYXN0TWFya2VyLCBzdGFydFRpbWUsIGVuZFRpbWUsIHRvdGFsRHVyYXRpb24sIHRpbWVsaW5lTWFya3N9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1zY3JvbGxlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUaW1lTWFya2VycygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lKCl9XG4gICAgICAgICAge3RoaXMucHJvcHMubWFya2Vycy5tYXAodGhpcy5yZW5kZXJNYXJrZXIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmVcIj5cbiAgICAgICAgJm5ic3A7XG4gICAgICAgIHt0aGlzLnN0YXRlLnRpbWVsaW5lTWFya3MubWFwKHRpbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGxlZnRQb3MgPSB0aW1lICogdGhpcy5wcm9wcy56b29tRmFjdG9yO1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgbGVmdDogbGVmdFBvcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmUtbGFiZWxcIiBzdHlsZT17c3R5bGV9IGtleT17YHRsOiR7dGltZX1gfT57dGltZX1tczwvc3Bhbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRpbWVNYXJrZXJzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlcnNcIj5cbiAgICAgICAge3RoaXMuc3RhdGUudGltZWxpbmVNYXJrcy5tYXAodGltZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGVmdFBvcyA9IHRpbWUgKiB0aGlzLnByb3BzLnpvb21GYWN0b3I7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0UG9zLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlclwiIHN0eWxlPXtzdHlsZX0ga2V5PXtgdG06JHt0aW1lfWB9IC8+O1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJNYXJrZXIobWFya2VyLCBpKSB7XG4gICAgaWYgKG1hcmtlci5nZXRTdGFydCgpID09PSBudWxsIHx8IG1hcmtlci5nZXRFbmQoKSA9PT0gbnVsbCkgeyByZXR1cm4gPGRpdiBrZXk9e2l9IC8+OyB9XG5cbiAgICBjb25zdCBzdGFydE9mZnNldCA9IG1hcmtlci5nZXRTdGFydCgpIC0gdGhpcy5zdGF0ZS5zdGFydFRpbWU7XG4gICAgY29uc3QgZHVyYXRpb24gPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBtYXJrZXJTdHlsZSA9IHtcbiAgICAgIGxlZnQ6IHN0YXJ0T2Zmc2V0ICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgICAgd2lkdGg6IGR1cmF0aW9uICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93XCIga2V5PXtpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93LWxhYmVsXCJcbiAgICAgICAgICBzdHlsZT17e3BhZGRpbmdMZWZ0OiBtYXJrZXJTdHlsZS5sZWZ0ICsgbWFya2VyU3R5bGUud2lkdGh9fT57bWFya2VyLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgPE1hcmtlclNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLW1hcmtlclwiIHN0eWxlPXttYXJrZXJTdHlsZX0gbWFya2VyPXttYXJrZXJ9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsV2lkZ2V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZVpvb21GYWN0b3JDaGFuZ2UnLCAnaGFuZGxlQ29sbGFwc2VDbGljaycsICdoYW5kbGVFeHBvcnRDbGljaycpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB6b29tRmFjdG9yOiAwLjMsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IG1hcmtlcnNbMF07XG4gICAgY29uc3QgbGFzdE1hcmtlciA9IG1hcmtlcnNbbWFya2Vycy5sZW5ndGggLSAxXTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IGZpcnN0TWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgZW5kVGltZSA9IGxhc3RNYXJrZXIuZ2V0RW5kKCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXdpZGdldCBpbnNldC1wYW5uZWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyLXRleHRcIj5cbiAgICAgICAgICAgIDxzcGFuIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29sbGFwc2VDbGlja30gY2xhc3NOYW1lPVwiY29sbGFwc2UtdG9nZ2xlXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNvbGxhcHNlZCA/ICdcXHUyNWI2JyA6ICdcXHUyNWJjJ31cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hcmtlcnMubGVuZ3RofSBldmVudChzKSBvdmVyIHtNYXRoLmZsb29yKGR1cmF0aW9uKX1tc1xuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWhlYWRlci1jb250cm9sc1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtZXhwb3J0LWJ1dHRvbiBidG4gYnRuLXNtXCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFeHBvcnRDbGlja30+RXhwb3J0PC9idXR0b24+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwic2VhcmNoXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1yYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj17MC4xfVxuICAgICAgICAgICAgICBtYXg9ezF9XG4gICAgICAgICAgICAgIHN0ZXA9ezAuMDF9XG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVpvb21GYWN0b3JDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMuc3RhdGUuY29sbGFwc2VkID8gbnVsbCA6IDxXYXRlcmZhbGwgbWFya2Vycz17dGhpcy5wcm9wcy5tYXJrZXJzfSB6b29tRmFjdG9yPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVpvb21GYWN0b3JDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3pvb21GYWN0b3I6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpfSk7XG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZUNsaWNrKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHMgPT4gKHtjb2xsYXBzZWQ6ICFzLmNvbGxhcHNlZH0pKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUV4cG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMubWFya2Vycy5tYXAobSA9PiBtLnNlcmlhbGl6ZSgpKSwgbnVsbCwgJyAgJyk7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IGpzb259KTtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICAgIGRlZmF1bHRQYXRoOiAnZ2l0LXRpbWluZ3MuanNvbicsXG4gICAgfSk7XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBidWZmZXIuc2F2ZUFzKGZpbGVQYXRoKTtcbiAgfVxufVxuXG5cbmxldCBtYXJrZXJzID0gbnVsbDtcbmxldCBncm91cElkID0gMDtcbmNvbnN0IGdyb3VwcyA9IFtdO1xubGV0IGxhc3RNYXJrZXJUaW1lID0gbnVsbDtcbmxldCB1cGRhdGVUaW1lciA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRpbWluZ3NWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgdXJpUGF0dGVybiA9ICdhdG9tLWdpdGh1YjovL2RlYnVnL3RpbWluZ3MnO1xuXG4gIHN0YXRpYyBidWlsZFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmlQYXR0ZXJuO1xuICB9XG5cbiAgc3RhdGljIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gIHN0YXRpYyBnZW5lcmF0ZU1hcmtlcihsYWJlbCkge1xuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIobGFiZWwsICgpID0+IHtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgaWYgKCFtYXJrZXJzIHx8IChsYXN0TWFya2VyVGltZSAmJiBNYXRoLmFicyhub3cgLSBsYXN0TWFya2VyVGltZSkgPj0gNTAwMCkpIHtcbiAgICAgIGdyb3VwSWQrKztcbiAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2Vyc30pO1xuICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgZ3JvdXBzLnBvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0TWFya2VyVGltZSA9IG5vdztcbiAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBzdGF0aWMgcmVzdG9yZUdyb3VwKGdyb3VwKSB7XG4gICAgZ3JvdXBJZCsrO1xuICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2VyczogZ3JvdXB9KTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSh0cnVlKTtcbiAgfVxuXG4gIHN0YXRpYyBzY2hlZHVsZVVwZGF0ZShpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIGlmICh1cGRhdGVUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHVwZGF0ZVRpbWVyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgR2l0VGltaW5nc1ZpZXcuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gICAgfSwgaW1tZWRpYXRlID8gMCA6IDEwMDApO1xuICB9XG5cbiAgc3RhdGljIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIEdpdFRpbWluZ3NWaWV3LmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlSW1wb3J0Q2xpY2snKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgR2l0VGltaW5nc1ZpZXcub25EaWRVcGRhdGUoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJpbXBvcnQtYnV0dG9uIGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0Q2xpY2t9PkltcG9ydDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2dyb3Vwcy5tYXAoKGdyb3VwLCBpZHgpID0+IChcbiAgICAgICAgICA8V2F0ZXJmYWxsV2lkZ2V0IGtleT17Z3JvdXAuaWR9IG1hcmtlcnM9e2dyb3VwLm1hcmtlcnN9IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUltcG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qge2ZpbGVQYXRoc30gPSBhd2FpdCBkaWFsb2cuc2hvd09wZW5EaWFsb2coe1xuICAgICAgcHJvcGVydGllczogWydvcGVuRmlsZSddLFxuICAgIH0pO1xuICAgIGlmICghZmlsZVBhdGhzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVQYXRoc1swXTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShmaWxlbmFtZSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVkTWFya2VycyA9IGRhdGEubWFwKGl0ZW0gPT4gTWFya2VyLmRlc2VyaWFsaXplKGl0ZW0pKTtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnJlc3RvcmVHcm91cChyZXN0b3JlZE1hcmtlcnMpO1xuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ291bGQgbm90IGltcG9ydCB0aW1pbmdzIGZyb20gJHtmaWxlbmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0dpdFRpbWluZ3NWaWV3JyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmJ1aWxkVVJJKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdEh1YiBQYWNrYWdlIFRpbWluZ3MgVmlldyc7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsU0FBQSxHQUFBRixPQUFBO0FBRUEsSUFBQUcsTUFBQSxHQUFBQyxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQUssU0FBQSxHQUFBRCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQU0sVUFBQSxHQUFBRixzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQU8sT0FBQSxHQUFBSCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQVEsUUFBQSxHQUFBSixzQkFBQSxDQUFBSixPQUFBO0FBRUEsSUFBQVMsUUFBQSxHQUFBTCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQVUsUUFBQSxHQUFBVixPQUFBO0FBQW9DLFNBQUFJLHVCQUFBTyxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcsU0FBQSxJQUFBQSxRQUFBLEdBQUFDLE1BQUEsQ0FBQUMsTUFBQSxHQUFBRCxNQUFBLENBQUFDLE1BQUEsQ0FBQUMsSUFBQSxlQUFBQyxNQUFBLGFBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsRUFBQUYsQ0FBQSxVQUFBRyxNQUFBLEdBQUFGLFNBQUEsQ0FBQUQsQ0FBQSxZQUFBSSxHQUFBLElBQUFELE1BQUEsUUFBQVAsTUFBQSxDQUFBUyxTQUFBLENBQUFDLGNBQUEsQ0FBQUMsSUFBQSxDQUFBSixNQUFBLEVBQUFDLEdBQUEsS0FBQUwsTUFBQSxDQUFB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