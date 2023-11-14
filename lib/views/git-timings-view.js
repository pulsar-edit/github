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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfZXZlbnRLaXQiLCJfZWxlY3Ryb24iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3Byb3BUeXBlcyIsIl9sb2Rhc2giLCJfZnNFeHRyYSIsIl9vY3RpY29uIiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsImV4Y2x1ZGVkIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzb3VyY2VTeW1ib2xLZXlzIiwiaW5kZXhPZiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic291cmNlS2V5cyIsImtleXMiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiX29iamVjdFNwcmVhZCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiZGlhbG9nIiwicmVtb3RlIiwiZ2VuQXJyYXkiLCJtZW1vaXplIiwiaW50ZXJ2YWwiLCJjb3VudCIsImFyciIsIk1hcmtlciIsImRlc2VyaWFsaXplIiwiZGF0YSIsIm1hcmtlciIsImxhYmVsIiwiZW5kIiwibWFya2VycyIsImNvbnN0cnVjdG9yIiwiZGlkVXBkYXRlIiwiZ2V0U3RhcnQiLCJzdGFydCIsImdldEVuZCIsIm1hcmsiLCJzZWN0aW9uTmFtZSIsIm5hbWUiLCJwZXJmb3JtYW5jZSIsIm5vdyIsImZpbmFsaXplIiwiZ2V0VGltaW5ncyIsIm1hcCIsInRpbWluZyIsImlkeCIsImFyeSIsIm5leHQiLCJzZXJpYWxpemUiLCJzbGljZSIsIk1hcmtlclRvb2x0aXAiLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInByb3BzIiwidGltaW5ncyIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsInRleHRBbGlnbiIsIm1heFdpZHRoIiwid2hpdGVTcGFjZSIsInBhZGRpbmdMZWZ0IiwibWFyZ2luVG9wIiwiZHVyYXRpb24iLCJNYXRoIiwiZmxvb3IiLCJQcm9wVHlwZXMiLCJpbnN0YW5jZU9mIiwiaXNSZXF1aXJlZCIsIkNPTE9SUyIsInF1ZXVlZCIsInByZXBhcmUiLCJuZXh0dGljayIsImV4ZWN1dGUiLCJpcGMiLCJNYXJrZXJTcGFuIiwiYXV0b2JpbmQiLCJfdGhpcyRwcm9wcyIsIm90aGVycyIsInRvdGFsVGltZSIsInBlcmNlbnRhZ2VzIiwiY29sb3IiLCJwZXJjZW50IiwicmVmIiwiYyIsImVsZW1lbnQiLCJvbk1vdXNlT3ZlciIsImhhbmRsZU1vdXNlT3ZlciIsIm9uTW91c2VPdXQiLCJoYW5kbGVNb3VzZU91dCIsIndpZHRoIiwiYmFja2dyb3VuZCIsImNsYXNzTmFtZSIsImVsZW0iLCJkb2N1bWVudCIsIlJlYWN0RG9tIiwidG9vbHRpcERpc3Bvc2FibGUiLCJhdG9tIiwidG9vbHRpcHMiLCJhZGQiLCJpdGVtIiwicGxhY2VtZW50IiwidHJpZ2dlciIsImNsb3NlVG9vbHRpcCIsImRpc3Bvc2UiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIldhdGVyZmFsbCIsImNvbnRleHQiLCJzdGF0ZSIsImdldE5leHRTdGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJzZXRTdGF0ZSIsImZpcnN0TWFya2VyIiwibGFzdE1hcmtlciIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJ0b3RhbER1cmF0aW9uIiwidGltZWxpbmVNYXJrSW50ZXJ2YWwiLCJ6b29tRmFjdG9yIiwidGltZWxpbmVNYXJrcyIsImNlaWwiLCJyZW5kZXJUaW1lTWFya2VycyIsInJlbmRlclRpbWVsaW5lIiwicmVuZGVyTWFya2VyIiwidGltZSIsImxlZnRQb3MiLCJsZWZ0Iiwic3RhcnRPZmZzZXQiLCJtYXJrZXJTdHlsZSIsImFycmF5T2YiLCJudW1iZXIiLCJXYXRlcmZhbGxXaWRnZXQiLCJjb2xsYXBzZWQiLCJvbkNsaWNrIiwiaGFuZGxlQ29sbGFwc2VDbGljayIsImhhbmRsZUV4cG9ydENsaWNrIiwiaWNvbiIsInR5cGUiLCJtaW4iLCJtYXgiLCJzdGVwIiwib25DaGFuZ2UiLCJoYW5kbGVab29tRmFjdG9yQ2hhbmdlIiwicGFyc2VGbG9hdCIsInMiLCJwcmV2ZW50RGVmYXVsdCIsImpzb24iLCJKU09OIiwic3RyaW5naWZ5IiwibSIsImJ1ZmZlciIsIlRleHRCdWZmZXIiLCJ0ZXh0IiwiZmlsZVBhdGgiLCJzaG93U2F2ZURpYWxvZyIsImRlZmF1bHRQYXRoIiwic2F2ZUFzIiwiZ3JvdXBJZCIsImdyb3VwcyIsImxhc3RNYXJrZXJUaW1lIiwidXBkYXRlVGltZXIiLCJHaXRUaW1pbmdzVmlldyIsImJ1aWxkVVJJIiwidXJpUGF0dGVybiIsImdlbmVyYXRlTWFya2VyIiwic2NoZWR1bGVVcGRhdGUiLCJhYnMiLCJ1bnNoaWZ0IiwiaWQiLCJwb3AiLCJyZXN0b3JlR3JvdXAiLCJncm91cCIsImltbWVkaWF0ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlbWl0dGVyIiwiZW1pdCIsIm9uRGlkVXBkYXRlIiwiY2FsbGJhY2siLCJvbiIsImNvbXBvbmVudERpZE1vdW50Iiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJmb3JjZVVwZGF0ZSIsImhhbmRsZUltcG9ydENsaWNrIiwiZmlsZVBhdGhzIiwic2hvd09wZW5EaWFsb2ciLCJwcm9wZXJ0aWVzIiwiZmlsZW5hbWUiLCJjb250ZW50cyIsImZzIiwicmVhZEZpbGUiLCJlbmNvZGluZyIsInBhcnNlIiwicmVzdG9yZWRNYXJrZXJzIiwiX2VyciIsIm5vdGlmaWNhdGlvbnMiLCJhZGRFcnJvciIsImRlc2VyaWFsaXplciIsImdldFVSSSIsImdldFRpdGxlIiwiZXhwb3J0cyIsIkVtaXR0ZXIiXSwic291cmNlcyI6WyJnaXQtdGltaW5ncy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuY29uc3Qge2RpYWxvZ30gPSByZW1vdGU7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBnZW5BcnJheSA9IG1lbW9pemUoZnVuY3Rpb24gZ2VuQXJyYXkoaW50ZXJ2YWwsIGNvdW50KSB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSBjb3VudDsgaSsrKSB7XG4gICAgYXJyLnB1c2goaW50ZXJ2YWwgKiBpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufSwgKGludGVydmFsLCBjb3VudCkgPT4gYCR7aW50ZXJ2YWx9OiR7Y291bnR9YCk7XG5cbmNsYXNzIE1hcmtlciB7XG4gIHN0YXRpYyBkZXNlcmlhbGl6ZShkYXRhKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IE1hcmtlcihkYXRhLmxhYmVsLCAoKSA9PiB7fSk7XG4gICAgbWFya2VyLmVuZCA9IGRhdGEuZW5kO1xuICAgIG1hcmtlci5tYXJrZXJzID0gZGF0YS5tYXJrZXJzO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihsYWJlbCwgZGlkVXBkYXRlKSB7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMuZGlkVXBkYXRlID0gZGlkVXBkYXRlO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGdldFN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubGVuZ3RoID8gdGhpcy5tYXJrZXJzWzBdLnN0YXJ0IDogbnVsbDtcbiAgfVxuXG4gIGdldEVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH1cblxuICBtYXJrKHNlY3Rpb25OYW1lLCBzdGFydCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHtuYW1lOiBzZWN0aW9uTmFtZSwgc3RhcnQ6IHN0YXJ0IHx8IHBlcmZvcm1hbmNlLm5vdygpfSk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLmVuZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICBnZXRUaW1pbmdzKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubWFwKCh0aW1pbmcsIGlkeCwgYXJ5KSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gYXJ5W2lkeCArIDFdO1xuICAgICAgY29uc3QgZW5kID0gbmV4dCA/IG5leHQuc3RhcnQgOiB0aGlzLmdldEVuZCgpO1xuICAgICAgcmV0dXJuIHsuLi50aW1pbmcsIGVuZH07XG4gICAgfSk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgZW5kOiB0aGlzLmVuZCxcbiAgICAgIG1hcmtlcnM6IHRoaXMubWFya2Vycy5zbGljZSgpLFxuICAgIH07XG4gIH1cbn1cblxuXG5jbGFzcyBNYXJrZXJUb29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdGltaW5ncyA9IG1hcmtlci5nZXRUaW1pbmdzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjogJ2xlZnQnLCBtYXhXaWR0aDogMzAwLCB3aGl0ZVNwYWNlOiAnaW5pdGlhbCd9fT5cbiAgICAgICAgPHN0cm9uZz48dHQ+e21hcmtlci5sYWJlbH08L3R0Pjwvc3Ryb25nPlxuICAgICAgICA8dWwgc3R5bGU9e3twYWRkaW5nTGVmdDogMjAsIG1hcmdpblRvcDogMTB9fT5cbiAgICAgICAgICB7dGltaW5ncy5tYXAoKHtuYW1lLCBzdGFydCwgZW5kfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBlbmQgLSBzdGFydDtcbiAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtuYW1lfT57bmFtZX06IHtNYXRoLmZsb29yKGR1cmF0aW9uICogMTAwKSAvIDEwMH1tczwvbGk+O1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBDT0xPUlMgPSB7XG4gIHF1ZXVlZDogJ3JlZCcsXG4gIHByZXBhcmU6ICdjeWFuJyxcbiAgbmV4dHRpY2s6ICd5ZWxsb3cnLFxuICBleGVjdXRlOiAnZ3JlZW4nLFxuICBpcGM6ICdwaW5rJyxcbn07XG5jbGFzcyBNYXJrZXJTcGFuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVNb3VzZU92ZXInLCAnaGFuZGxlTW91c2VPdXQnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB0aW1pbmdzID0gbWFya2VyLmdldFRpbWluZ3MoKTtcbiAgICBjb25zdCB0b3RhbFRpbWUgPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBwZXJjZW50YWdlcyA9IHRpbWluZ3MubWFwKCh7bmFtZSwgc3RhcnQsIGVuZH0pID0+IHtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kIC0gc3RhcnQ7XG4gICAgICByZXR1cm4ge2NvbG9yOiBDT0xPUlNbbmFtZV0sIHBlcmNlbnQ6IGR1cmF0aW9uIC8gdG90YWxUaW1lICogMTAwfTtcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgey4uLm90aGVyc31cbiAgICAgICAgcmVmPXtjID0+IHsgdGhpcy5lbGVtZW50ID0gYzsgfX1cbiAgICAgICAgb25Nb3VzZU92ZXI9e3RoaXMuaGFuZGxlTW91c2VPdmVyfVxuICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAge3BlcmNlbnRhZ2VzLm1hcCgoe2NvbG9yLCBwZXJjZW50fSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgd2lkdGg6IGAke3BlcmNlbnR9JWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvcixcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtbWFya2VyLXNlY3Rpb25cIiBrZXk9e2l9IHN0eWxlPXtzdHlsZX0gLz47XG4gICAgICAgIH0pfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU92ZXIoZSkge1xuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBSZWFjdERvbS5yZW5kZXIoPE1hcmtlclRvb2x0aXAgbWFya2VyPXt0aGlzLnByb3BzLm1hcmtlcn0gLz4sIGVsZW0pO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIGl0ZW06IGVsZW0sXG4gICAgICBwbGFjZW1lbnQ6ICdhdXRvIGJvdHRvbScsXG4gICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlVG9vbHRpcCgpIHtcbiAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlICYmIHRoaXMudG9vbHRpcERpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQoZSkge1xuICAgIHRoaXMuY2xvc2VUb29sdGlwKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNsb3NlVG9vbHRpcCgpO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICAgIHpvb21GYWN0b3I6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJNYXJrZXInKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXROZXh0U3RhdGUocHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TmV4dFN0YXRlKG5leHRQcm9wcykpO1xuICB9XG5cbiAgZ2V0TmV4dFN0YXRlKHByb3BzKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gcHJvcHM7XG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSBtYXJrZXJzWzBdO1xuICAgIGNvbnN0IGxhc3RNYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV07XG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBmaXJzdE1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsYXN0TWFya2VyLmdldEVuZCgpO1xuICAgIGNvbnN0IHRvdGFsRHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIGxldCB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IG51bGw7XG4gICAgaWYgKHByb3BzLnpvb21GYWN0b3IgPD0gMC4xNSkge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSAxMDAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjMpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gNTAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjYpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gMjUwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDEwMDtcbiAgICB9XG4gICAgY29uc3QgdGltZWxpbmVNYXJrcyA9IGdlbkFycmF5KHRpbWVsaW5lTWFya0ludGVydmFsLCBNYXRoLmNlaWwodG90YWxEdXJhdGlvbiAvIHRpbWVsaW5lTWFya0ludGVydmFsKSk7XG5cbiAgICByZXR1cm4ge2ZpcnN0TWFya2VyLCBsYXN0TWFya2VyLCBzdGFydFRpbWUsIGVuZFRpbWUsIHRvdGFsRHVyYXRpb24sIHRpbWVsaW5lTWFya3N9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1zY3JvbGxlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUaW1lTWFya2VycygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lKCl9XG4gICAgICAgICAge3RoaXMucHJvcHMubWFya2Vycy5tYXAodGhpcy5yZW5kZXJNYXJrZXIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmVcIj5cbiAgICAgICAgJm5ic3A7XG4gICAgICAgIHt0aGlzLnN0YXRlLnRpbWVsaW5lTWFya3MubWFwKHRpbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGxlZnRQb3MgPSB0aW1lICogdGhpcy5wcm9wcy56b29tRmFjdG9yO1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgbGVmdDogbGVmdFBvcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmUtbGFiZWxcIiBzdHlsZT17c3R5bGV9IGtleT17YHRsOiR7dGltZX1gfT57dGltZX1tczwvc3Bhbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRpbWVNYXJrZXJzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlcnNcIj5cbiAgICAgICAge3RoaXMuc3RhdGUudGltZWxpbmVNYXJrcy5tYXAodGltZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGVmdFBvcyA9IHRpbWUgKiB0aGlzLnByb3BzLnpvb21GYWN0b3I7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0UG9zLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlclwiIHN0eWxlPXtzdHlsZX0ga2V5PXtgdG06JHt0aW1lfWB9IC8+O1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJNYXJrZXIobWFya2VyLCBpKSB7XG4gICAgaWYgKG1hcmtlci5nZXRTdGFydCgpID09PSBudWxsIHx8IG1hcmtlci5nZXRFbmQoKSA9PT0gbnVsbCkgeyByZXR1cm4gPGRpdiBrZXk9e2l9IC8+OyB9XG5cbiAgICBjb25zdCBzdGFydE9mZnNldCA9IG1hcmtlci5nZXRTdGFydCgpIC0gdGhpcy5zdGF0ZS5zdGFydFRpbWU7XG4gICAgY29uc3QgZHVyYXRpb24gPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBtYXJrZXJTdHlsZSA9IHtcbiAgICAgIGxlZnQ6IHN0YXJ0T2Zmc2V0ICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgICAgd2lkdGg6IGR1cmF0aW9uICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93XCIga2V5PXtpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93LWxhYmVsXCJcbiAgICAgICAgICBzdHlsZT17e3BhZGRpbmdMZWZ0OiBtYXJrZXJTdHlsZS5sZWZ0ICsgbWFya2VyU3R5bGUud2lkdGh9fT57bWFya2VyLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgPE1hcmtlclNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLW1hcmtlclwiIHN0eWxlPXttYXJrZXJTdHlsZX0gbWFya2VyPXttYXJrZXJ9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsV2lkZ2V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZVpvb21GYWN0b3JDaGFuZ2UnLCAnaGFuZGxlQ29sbGFwc2VDbGljaycsICdoYW5kbGVFeHBvcnRDbGljaycpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB6b29tRmFjdG9yOiAwLjMsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IG1hcmtlcnNbMF07XG4gICAgY29uc3QgbGFzdE1hcmtlciA9IG1hcmtlcnNbbWFya2Vycy5sZW5ndGggLSAxXTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IGZpcnN0TWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgZW5kVGltZSA9IGxhc3RNYXJrZXIuZ2V0RW5kKCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXdpZGdldCBpbnNldC1wYW5uZWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyLXRleHRcIj5cbiAgICAgICAgICAgIDxzcGFuIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29sbGFwc2VDbGlja30gY2xhc3NOYW1lPVwiY29sbGFwc2UtdG9nZ2xlXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNvbGxhcHNlZCA/ICdcXHUyNWI2JyA6ICdcXHUyNWJjJ31cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hcmtlcnMubGVuZ3RofSBldmVudChzKSBvdmVyIHtNYXRoLmZsb29yKGR1cmF0aW9uKX1tc1xuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWhlYWRlci1jb250cm9sc1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtZXhwb3J0LWJ1dHRvbiBidG4gYnRuLXNtXCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFeHBvcnRDbGlja30+RXhwb3J0PC9idXR0b24+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwic2VhcmNoXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1yYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj17MC4xfVxuICAgICAgICAgICAgICBtYXg9ezF9XG4gICAgICAgICAgICAgIHN0ZXA9ezAuMDF9XG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVpvb21GYWN0b3JDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMuc3RhdGUuY29sbGFwc2VkID8gbnVsbCA6IDxXYXRlcmZhbGwgbWFya2Vycz17dGhpcy5wcm9wcy5tYXJrZXJzfSB6b29tRmFjdG9yPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVpvb21GYWN0b3JDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3pvb21GYWN0b3I6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpfSk7XG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZUNsaWNrKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHMgPT4gKHtjb2xsYXBzZWQ6ICFzLmNvbGxhcHNlZH0pKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUV4cG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMubWFya2Vycy5tYXAobSA9PiBtLnNlcmlhbGl6ZSgpKSwgbnVsbCwgJyAgJyk7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IGpzb259KTtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICAgIGRlZmF1bHRQYXRoOiAnZ2l0LXRpbWluZ3MuanNvbicsXG4gICAgfSk7XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBidWZmZXIuc2F2ZUFzKGZpbGVQYXRoKTtcbiAgfVxufVxuXG5cbmxldCBtYXJrZXJzID0gbnVsbDtcbmxldCBncm91cElkID0gMDtcbmNvbnN0IGdyb3VwcyA9IFtdO1xubGV0IGxhc3RNYXJrZXJUaW1lID0gbnVsbDtcbmxldCB1cGRhdGVUaW1lciA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRpbWluZ3NWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgdXJpUGF0dGVybiA9ICdhdG9tLWdpdGh1YjovL2RlYnVnL3RpbWluZ3MnO1xuXG4gIHN0YXRpYyBidWlsZFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmlQYXR0ZXJuO1xuICB9XG5cbiAgc3RhdGljIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gIHN0YXRpYyBnZW5lcmF0ZU1hcmtlcihsYWJlbCkge1xuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIobGFiZWwsICgpID0+IHtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgaWYgKCFtYXJrZXJzIHx8IChsYXN0TWFya2VyVGltZSAmJiBNYXRoLmFicyhub3cgLSBsYXN0TWFya2VyVGltZSkgPj0gNTAwMCkpIHtcbiAgICAgIGdyb3VwSWQrKztcbiAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2Vyc30pO1xuICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgZ3JvdXBzLnBvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0TWFya2VyVGltZSA9IG5vdztcbiAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBzdGF0aWMgcmVzdG9yZUdyb3VwKGdyb3VwKSB7XG4gICAgZ3JvdXBJZCsrO1xuICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2VyczogZ3JvdXB9KTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSh0cnVlKTtcbiAgfVxuXG4gIHN0YXRpYyBzY2hlZHVsZVVwZGF0ZShpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIGlmICh1cGRhdGVUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHVwZGF0ZVRpbWVyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgR2l0VGltaW5nc1ZpZXcuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gICAgfSwgaW1tZWRpYXRlID8gMCA6IDEwMDApO1xuICB9XG5cbiAgc3RhdGljIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIEdpdFRpbWluZ3NWaWV3LmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlSW1wb3J0Q2xpY2snKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgR2l0VGltaW5nc1ZpZXcub25EaWRVcGRhdGUoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJpbXBvcnQtYnV0dG9uIGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0Q2xpY2t9PkltcG9ydDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2dyb3Vwcy5tYXAoKGdyb3VwLCBpZHgpID0+IChcbiAgICAgICAgICA8V2F0ZXJmYWxsV2lkZ2V0IGtleT17Z3JvdXAuaWR9IG1hcmtlcnM9e2dyb3VwLm1hcmtlcnN9IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUltcG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qge2ZpbGVQYXRoc30gPSBhd2FpdCBkaWFsb2cuc2hvd09wZW5EaWFsb2coe1xuICAgICAgcHJvcGVydGllczogWydvcGVuRmlsZSddLFxuICAgIH0pO1xuICAgIGlmICghZmlsZVBhdGhzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVQYXRoc1swXTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShmaWxlbmFtZSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVkTWFya2VycyA9IGRhdGEubWFwKGl0ZW0gPT4gTWFya2VyLmRlc2VyaWFsaXplKGl0ZW0pKTtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnJlc3RvcmVHcm91cChyZXN0b3JlZE1hcmtlcnMpO1xuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ291bGQgbm90IGltcG9ydCB0aW1pbmdzIGZyb20gJHtmaWxlbmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0dpdFRpbWluZ3NWaWV3JyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmJ1aWxkVVJJKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdEh1YiBQYWNrYWdlIFRpbWluZ3MgVmlldyc7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBO0FBQ0EsSUFBQUUsU0FBQSxHQUFBRixPQUFBO0FBRUEsSUFBQUcsTUFBQSxHQUFBQyxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQUssU0FBQSxHQUFBRCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQU0sVUFBQSxHQUFBRixzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQU8sT0FBQSxHQUFBSCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQVEsUUFBQSxHQUFBSixzQkFBQSxDQUFBSixPQUFBO0FBRUEsSUFBQVMsUUFBQSxHQUFBTCxzQkFBQSxDQUFBSixPQUFBO0FBQ0EsSUFBQVUsUUFBQSxHQUFBVixPQUFBO0FBQW9DLFNBQUFJLHVCQUFBTyxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBQyxVQUFBLEdBQUFELEdBQUEsS0FBQUUsT0FBQSxFQUFBRixHQUFBO0FBQUEsU0FBQUcsU0FBQSxJQUFBQSxRQUFBLEdBQUFDLE1BQUEsQ0FBQUMsTUFBQSxHQUFBRCxNQUFBLENBQUFDLE1BQUEsQ0FBQUMsSUFBQSxlQUFBQyxNQUFBLGFBQUFDLENBQUEsTUFBQUEsQ0FBQSxHQUFBQyxTQUFBLENBQUFDLE1BQUEsRUFBQUYsQ0FBQSxVQUFBRyxNQUFBLEdBQUFGLFNBQUEsQ0FBQUQsQ0FBQSxZQUFBSSxHQUFBLElBQUFELE1BQUEsUUFBQVAsTUFBQSxDQUFBUyxTQUFBLENBQUFDLGNBQUEsQ0FBQUMsSUFBQSxDQUFBSixNQUFBLEVBQUFDLEdBQUEsS0FBQUwsTUFBQSxDQUFBSyxHQUFBLElBQUFELE1BQUEsQ0FBQUMsR0FBQSxn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