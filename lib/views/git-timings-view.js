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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXRvbSIsInJlcXVpcmUiLCJfZXZlbnRLaXQiLCJfZWxlY3Ryb24iLCJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwiX3JlYWN0RG9tIiwiX3Byb3BUeXBlcyIsIl9sb2Rhc2giLCJfZnNFeHRyYSIsIl9vY3RpY29uIiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9leHRlbmRzIiwiT2JqZWN0IiwiYXNzaWduIiwiYmluZCIsInRhcmdldCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJzb3VyY2UiLCJrZXkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJhcHBseSIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsImV4Y2x1ZGVkIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzb3VyY2VTeW1ib2xLZXlzIiwiaW5kZXhPZiIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwic291cmNlS2V5cyIsImtleXMiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwibyIsImZpbHRlciIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiX29iamVjdFNwcmVhZCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJkaWFsb2ciLCJyZW1vdGUiLCJnZW5BcnJheSIsIm1lbW9pemUiLCJpbnRlcnZhbCIsImNvdW50IiwiYXJyIiwiTWFya2VyIiwiZGVzZXJpYWxpemUiLCJkYXRhIiwibWFya2VyIiwibGFiZWwiLCJlbmQiLCJtYXJrZXJzIiwiY29uc3RydWN0b3IiLCJkaWRVcGRhdGUiLCJnZXRTdGFydCIsInN0YXJ0IiwiZ2V0RW5kIiwibWFyayIsInNlY3Rpb25OYW1lIiwibmFtZSIsInBlcmZvcm1hbmNlIiwibm93IiwiZmluYWxpemUiLCJnZXRUaW1pbmdzIiwibWFwIiwidGltaW5nIiwiaWR4IiwiYXJ5IiwibmV4dCIsInNlcmlhbGl6ZSIsInNsaWNlIiwiTWFya2VyVG9vbHRpcCIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJ0aW1pbmdzIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwidGV4dEFsaWduIiwibWF4V2lkdGgiLCJ3aGl0ZVNwYWNlIiwicGFkZGluZ0xlZnQiLCJtYXJnaW5Ub3AiLCJkdXJhdGlvbiIsIk1hdGgiLCJmbG9vciIsIlByb3BUeXBlcyIsImluc3RhbmNlT2YiLCJpc1JlcXVpcmVkIiwiQ09MT1JTIiwicXVldWVkIiwicHJlcGFyZSIsIm5leHR0aWNrIiwiZXhlY3V0ZSIsImlwYyIsIk1hcmtlclNwYW4iLCJhdXRvYmluZCIsIl90aGlzJHByb3BzIiwib3RoZXJzIiwidG90YWxUaW1lIiwicGVyY2VudGFnZXMiLCJjb2xvciIsInBlcmNlbnQiLCJyZWYiLCJjIiwiZWxlbWVudCIsIm9uTW91c2VPdmVyIiwiaGFuZGxlTW91c2VPdmVyIiwib25Nb3VzZU91dCIsImhhbmRsZU1vdXNlT3V0Iiwid2lkdGgiLCJiYWNrZ3JvdW5kIiwiY2xhc3NOYW1lIiwiZWxlbSIsImRvY3VtZW50IiwiUmVhY3REb20iLCJ0b29sdGlwRGlzcG9zYWJsZSIsImF0b20iLCJ0b29sdGlwcyIsImFkZCIsIml0ZW0iLCJwbGFjZW1lbnQiLCJ0cmlnZ2VyIiwiY2xvc2VUb29sdGlwIiwiZGlzcG9zZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiV2F0ZXJmYWxsIiwiY29udGV4dCIsInN0YXRlIiwiZ2V0TmV4dFN0YXRlIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwiZmlyc3RNYXJrZXIiLCJsYXN0TWFya2VyIiwic3RhcnRUaW1lIiwiZW5kVGltZSIsInRvdGFsRHVyYXRpb24iLCJ0aW1lbGluZU1hcmtJbnRlcnZhbCIsInpvb21GYWN0b3IiLCJ0aW1lbGluZU1hcmtzIiwiY2VpbCIsInJlbmRlclRpbWVNYXJrZXJzIiwicmVuZGVyVGltZWxpbmUiLCJyZW5kZXJNYXJrZXIiLCJ0aW1lIiwibGVmdFBvcyIsImxlZnQiLCJzdGFydE9mZnNldCIsIm1hcmtlclN0eWxlIiwiYXJyYXlPZiIsIm51bWJlciIsIldhdGVyZmFsbFdpZGdldCIsImNvbGxhcHNlZCIsIm9uQ2xpY2siLCJoYW5kbGVDb2xsYXBzZUNsaWNrIiwiaGFuZGxlRXhwb3J0Q2xpY2siLCJpY29uIiwidHlwZSIsIm1pbiIsIm1heCIsInN0ZXAiLCJvbkNoYW5nZSIsImhhbmRsZVpvb21GYWN0b3JDaGFuZ2UiLCJwYXJzZUZsb2F0IiwicyIsInByZXZlbnREZWZhdWx0IiwianNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJtIiwiYnVmZmVyIiwiVGV4dEJ1ZmZlciIsInRleHQiLCJmaWxlUGF0aCIsInNob3dTYXZlRGlhbG9nIiwiZGVmYXVsdFBhdGgiLCJzYXZlQXMiLCJncm91cElkIiwiZ3JvdXBzIiwibGFzdE1hcmtlclRpbWUiLCJ1cGRhdGVUaW1lciIsIkdpdFRpbWluZ3NWaWV3IiwiYnVpbGRVUkkiLCJ1cmlQYXR0ZXJuIiwiZ2VuZXJhdGVNYXJrZXIiLCJzY2hlZHVsZVVwZGF0ZSIsImFicyIsInVuc2hpZnQiLCJpZCIsInBvcCIsInJlc3RvcmVHcm91cCIsImdyb3VwIiwiaW1tZWRpYXRlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVtaXR0ZXIiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYWxsYmFjayIsIm9uIiwiY29tcG9uZW50RGlkTW91bnQiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImZvcmNlVXBkYXRlIiwiaGFuZGxlSW1wb3J0Q2xpY2siLCJmaWxlUGF0aHMiLCJzaG93T3BlbkRpYWxvZyIsInByb3BlcnRpZXMiLCJmaWxlbmFtZSIsImNvbnRlbnRzIiwiZnMiLCJyZWFkRmlsZSIsImVuY29kaW5nIiwicGFyc2UiLCJyZXN0b3JlZE1hcmtlcnMiLCJfZXJyIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGVzZXJpYWxpemVyIiwiZ2V0VVJJIiwiZ2V0VGl0bGUiLCJleHBvcnRzIiwiRW1pdHRlciJdLCJzb3VyY2VzIjpbImdpdC10aW1pbmdzLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5jb25zdCB7ZGlhbG9nfSA9IHJlbW90ZTtcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3REb20gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgbWVtb2l6ZSBmcm9tICdsb2Rhc2gubWVtb2l6ZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IGdlbkFycmF5ID0gbWVtb2l6ZShmdW5jdGlvbiBnZW5BcnJheShpbnRlcnZhbCwgY291bnQpIHtcbiAgY29uc3QgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IGNvdW50OyBpKyspIHtcbiAgICBhcnIucHVzaChpbnRlcnZhbCAqIGkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59LCAoaW50ZXJ2YWwsIGNvdW50KSA9PiBgJHtpbnRlcnZhbH06JHtjb3VudH1gKTtcblxuY2xhc3MgTWFya2VyIHtcbiAgc3RhdGljIGRlc2VyaWFsaXplKGRhdGEpIHtcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgTWFya2VyKGRhdGEubGFiZWwsICgpID0+IHt9KTtcbiAgICBtYXJrZXIuZW5kID0gZGF0YS5lbmQ7XG4gICAgbWFya2VyLm1hcmtlcnMgPSBkYXRhLm1hcmtlcnM7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGxhYmVsLCBkaWRVcGRhdGUpIHtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy5kaWRVcGRhdGUgPSBkaWRVcGRhdGU7XG4gICAgdGhpcy5lbmQgPSBudWxsO1xuICAgIHRoaXMubWFya2VycyA9IFtdO1xuICB9XG5cbiAgZ2V0U3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2Vycy5sZW5ndGggPyB0aGlzLm1hcmtlcnNbMF0uc3RhcnQgOiBudWxsO1xuICB9XG5cbiAgZ2V0RW5kKCkge1xuICAgIHJldHVybiB0aGlzLmVuZDtcbiAgfVxuXG4gIG1hcmsoc2VjdGlvbk5hbWUsIHN0YXJ0KSB7XG4gICAgdGhpcy5tYXJrZXJzLnB1c2goe25hbWU6IHNlY3Rpb25OYW1lLCBzdGFydDogc3RhcnQgfHwgcGVyZm9ybWFuY2Uubm93KCl9KTtcbiAgfVxuXG4gIGZpbmFsaXplKCkge1xuICAgIHRoaXMuZW5kID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy5kaWRVcGRhdGUoKTtcbiAgfVxuXG4gIGdldFRpbWluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2Vycy5tYXAoKHRpbWluZywgaWR4LCBhcnkpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSBhcnlbaWR4ICsgMV07XG4gICAgICBjb25zdCBlbmQgPSBuZXh0ID8gbmV4dC5zdGFydCA6IHRoaXMuZ2V0RW5kKCk7XG4gICAgICByZXR1cm4gey4uLnRpbWluZywgZW5kfTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBlbmQ6IHRoaXMuZW5kLFxuICAgICAgbWFya2VyczogdGhpcy5tYXJrZXJzLnNsaWNlKCksXG4gICAgfTtcbiAgfVxufVxuXG5cbmNsYXNzIE1hcmtlclRvb2x0aXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1hcmtlcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoTWFya2VyKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXJrZXJ9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB0aW1pbmdzID0gbWFya2VyLmdldFRpbWluZ3MoKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7dGV4dEFsaWduOiAnbGVmdCcsIG1heFdpZHRoOiAzMDAsIHdoaXRlU3BhY2U6ICdpbml0aWFsJ319PlxuICAgICAgICA8c3Ryb25nPjx0dD57bWFya2VyLmxhYmVsfTwvdHQ+PC9zdHJvbmc+XG4gICAgICAgIDx1bCBzdHlsZT17e3BhZGRpbmdMZWZ0OiAyMCwgbWFyZ2luVG9wOiAxMH19PlxuICAgICAgICAgIHt0aW1pbmdzLm1hcCgoe25hbWUsIHN0YXJ0LCBlbmR9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IGVuZCAtIHN0YXJ0O1xuICAgICAgICAgICAgcmV0dXJuIDxsaSBrZXk9e25hbWV9PntuYW1lfToge01hdGguZmxvb3IoZHVyYXRpb24gKiAxMDApIC8gMTAwfW1zPC9saT47XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmNvbnN0IENPTE9SUyA9IHtcbiAgcXVldWVkOiAncmVkJyxcbiAgcHJlcGFyZTogJ2N5YW4nLFxuICBuZXh0dGljazogJ3llbGxvdycsXG4gIGV4ZWN1dGU6ICdncmVlbicsXG4gIGlwYzogJ3BpbmsnLFxufTtcbmNsYXNzIE1hcmtlclNwYW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1hcmtlcjogUHJvcFR5cGVzLmluc3RhbmNlT2YoTWFya2VyKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZU1vdXNlT3ZlcicsICdoYW5kbGVNb3VzZU91dCcpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXJrZXIsIC4uLm90aGVyc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHRpbWluZ3MgPSBtYXJrZXIuZ2V0VGltaW5ncygpO1xuICAgIGNvbnN0IHRvdGFsVGltZSA9IG1hcmtlci5nZXRFbmQoKSAtIG1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2VzID0gdGltaW5ncy5tYXAoKHtuYW1lLCBzdGFydCwgZW5kfSkgPT4ge1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBlbmQgLSBzdGFydDtcbiAgICAgIHJldHVybiB7Y29sb3I6IENPTE9SU1tuYW1lXSwgcGVyY2VudDogZHVyYXRpb24gLyB0b3RhbFRpbWUgKiAxMDB9O1xuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICB7Li4ub3RoZXJzfVxuICAgICAgICByZWY9e2MgPT4geyB0aGlzLmVsZW1lbnQgPSBjOyB9fVxuICAgICAgICBvbk1vdXNlT3Zlcj17dGhpcy5oYW5kbGVNb3VzZU92ZXJ9XG4gICAgICAgIG9uTW91c2VPdXQ9e3RoaXMuaGFuZGxlTW91c2VPdXR9PlxuICAgICAgICB7cGVyY2VudGFnZXMubWFwKCh7Y29sb3IsIHBlcmNlbnR9LCBpKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgICAgICB3aWR0aDogYCR7cGVyY2VudH0lYCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC1tYXJrZXItc2VjdGlvblwiIGtleT17aX0gc3R5bGU9e3N0eWxlfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3ZlcihlKSB7XG4gICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIFJlYWN0RG9tLnJlbmRlcig8TWFya2VyVG9vbHRpcCBtYXJrZXI9e3RoaXMucHJvcHMubWFya2VyfSAvPiwgZWxlbSk7XG4gICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZSA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgaXRlbTogZWxlbSxcbiAgICAgIHBsYWNlbWVudDogJ2F1dG8gYm90dG9tJyxcbiAgICAgIHRyaWdnZXI6ICdtYW51YWwnLFxuICAgIH0pO1xuICB9XG5cbiAgY2xvc2VUb29sdGlwKCkge1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgJiYgdGhpcy50b29sdGlwRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZSA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVNb3VzZU91dChlKSB7XG4gICAgdGhpcy5jbG9zZVRvb2x0aXAoKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuY2xvc2VUb29sdGlwKCk7XG4gIH1cbn1cblxuXG5jbGFzcyBXYXRlcmZhbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1hcmtlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikpLmlzUmVxdWlyZWQsXG4gICAgem9vbUZhY3RvcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ3JlbmRlck1hcmtlcicpO1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldE5leHRTdGF0ZShwcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXROZXh0U3RhdGUobmV4dFByb3BzKSk7XG4gIH1cblxuICBnZXROZXh0U3RhdGUocHJvcHMpIHtcbiAgICBjb25zdCB7bWFya2Vyc30gPSBwcm9wcztcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IG1hcmtlcnNbMF07XG4gICAgY29uc3QgbGFzdE1hcmtlciA9IG1hcmtlcnNbbWFya2Vycy5sZW5ndGggLSAxXTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IGZpcnN0TWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgZW5kVGltZSA9IGxhc3RNYXJrZXIuZ2V0RW5kKCk7XG4gICAgY29uc3QgdG90YWxEdXJhdGlvbiA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG4gICAgbGV0IHRpbWVsaW5lTWFya0ludGVydmFsID0gbnVsbDtcbiAgICBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjE1KSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDEwMDA7XG4gICAgfSBlbHNlIGlmIChwcm9wcy56b29tRmFjdG9yIDw9IDAuMykge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSA1MDA7XG4gICAgfSBlbHNlIGlmIChwcm9wcy56b29tRmFjdG9yIDw9IDAuNikge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSAyNTA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gMTAwO1xuICAgIH1cbiAgICBjb25zdCB0aW1lbGluZU1hcmtzID0gZ2VuQXJyYXkodGltZWxpbmVNYXJrSW50ZXJ2YWwsIE1hdGguY2VpbCh0b3RhbER1cmF0aW9uIC8gdGltZWxpbmVNYXJrSW50ZXJ2YWwpKTtcblxuICAgIHJldHVybiB7Zmlyc3RNYXJrZXIsIGxhc3RNYXJrZXIsIHN0YXJ0VGltZSwgZW5kVGltZSwgdG90YWxEdXJhdGlvbiwgdGltZWxpbmVNYXJrc307XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXNjcm9sbGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclRpbWVNYXJrZXJzKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmUoKX1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5tYXJrZXJzLm1hcCh0aGlzLnJlbmRlck1hcmtlcil9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRpbWVsaW5lKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lbGluZVwiPlxuICAgICAgICAmbmJzcDtcbiAgICAgICAge3RoaXMuc3RhdGUudGltZWxpbmVNYXJrcy5tYXAodGltZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGVmdFBvcyA9IHRpbWUgKiB0aGlzLnByb3BzLnpvb21GYWN0b3I7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0UG9zLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lbGluZS1sYWJlbFwiIHN0eWxlPXtzdHlsZX0ga2V5PXtgdGw6JHt0aW1lfWB9Pnt0aW1lfW1zPC9zcGFuPjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGltZU1hcmtlcnMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXRpbWUtbWFya2Vyc1wiPlxuICAgICAgICB7dGhpcy5zdGF0ZS50aW1lbGluZU1hcmtzLm1hcCh0aW1lID0+IHtcbiAgICAgICAgICBjb25zdCBsZWZ0UG9zID0gdGltZSAqIHRoaXMucHJvcHMuem9vbUZhY3RvcjtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXRpbWUtbWFya2VyXCIgc3R5bGU9e3N0eWxlfSBrZXk9e2B0bToke3RpbWV9YH0gLz47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlck1hcmtlcihtYXJrZXIsIGkpIHtcbiAgICBpZiAobWFya2VyLmdldFN0YXJ0KCkgPT09IG51bGwgfHwgbWFya2VyLmdldEVuZCgpID09PSBudWxsKSB7IHJldHVybiA8ZGl2IGtleT17aX0gLz47IH1cblxuICAgIGNvbnN0IHN0YXJ0T2Zmc2V0ID0gbWFya2VyLmdldFN0YXJ0KCkgLSB0aGlzLnN0YXRlLnN0YXJ0VGltZTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG1hcmtlci5nZXRFbmQoKSAtIG1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IG1hcmtlclN0eWxlID0ge1xuICAgICAgbGVmdDogc3RhcnRPZmZzZXQgKiB0aGlzLnByb3BzLnpvb21GYWN0b3IsXG4gICAgICB3aWR0aDogZHVyYXRpb24gKiB0aGlzLnByb3BzLnpvb21GYWN0b3IsXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1yb3dcIiBrZXk9e2l9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT1cIndhdGVyZmFsbC1yb3ctbGFiZWxcIlxuICAgICAgICAgIHN0eWxlPXt7cGFkZGluZ0xlZnQ6IG1hcmtlclN0eWxlLmxlZnQgKyBtYXJrZXJTdHlsZS53aWR0aH19PnttYXJrZXIubGFiZWx9PC9zcGFuPlxuICAgICAgICA8TWFya2VyU3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtbWFya2VyXCIgc3R5bGU9e21hcmtlclN0eWxlfSBtYXJrZXI9e21hcmtlcn0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuXG5jbGFzcyBXYXRlcmZhbGxXaWRnZXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1hcmtlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikpLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlWm9vbUZhY3RvckNoYW5nZScsICdoYW5kbGVDb2xsYXBzZUNsaWNrJywgJ2hhbmRsZUV4cG9ydENsaWNrJyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHpvb21GYWN0b3I6IDAuMyxcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2Vyc30gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gbWFya2Vyc1swXTtcbiAgICBjb25zdCBsYXN0TWFya2VyID0gbWFya2Vyc1ttYXJrZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gZmlyc3RNYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBlbmRUaW1lID0gbGFzdE1hcmtlci5nZXRFbmQoKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtd2lkZ2V0IGluc2V0LXBhbm5lbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1oZWFkZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1oZWFkZXItdGV4dFwiPlxuICAgICAgICAgICAgPHNwYW4gb25DbGljaz17dGhpcy5oYW5kbGVDb2xsYXBzZUNsaWNrfSBjbGFzc05hbWU9XCJjb2xsYXBzZS10b2dnbGVcIj5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuY29sbGFwc2VkID8gJ1xcdTI1YjYnIDogJ1xcdTI1YmMnfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucHJvcHMubWFya2Vycy5sZW5ndGh9IGV2ZW50KHMpIG92ZXIge01hdGguZmxvb3IoZHVyYXRpb24pfW1zXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyLWNvbnRyb2xzXCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIndhdGVyZmFsbC1leHBvcnQtYnV0dG9uIGJ0biBidG4tc21cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUV4cG9ydENsaWNrfT5FeHBvcnQ8L2J1dHRvbj5cbiAgICAgICAgICAgIDxPY3RpY29uIGljb249XCJzZWFyY2hcIiAvPlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0LXJhbmdlXCJcbiAgICAgICAgICAgICAgbWluPXswLjF9XG4gICAgICAgICAgICAgIG1heD17MX1cbiAgICAgICAgICAgICAgc3RlcD17MC4wMX1cbiAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuem9vbUZhY3Rvcn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlWm9vbUZhY3RvckNoYW5nZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5zdGF0ZS5jb2xsYXBzZWQgPyBudWxsIDogPFdhdGVyZmFsbCBtYXJrZXJzPXt0aGlzLnByb3BzLm1hcmtlcnN9IHpvb21GYWN0b3I9e3RoaXMuc3RhdGUuem9vbUZhY3Rvcn0gLz59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlWm9vbUZhY3RvckNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7em9vbUZhY3RvcjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSl9KTtcbiAgfVxuXG4gIGhhbmRsZUNvbGxhcHNlQ2xpY2soZSkge1xuICAgIHRoaXMuc2V0U3RhdGUocyA9PiAoe2NvbGxhcHNlZDogIXMuY29sbGFwc2VkfSkpO1xuICB9XG5cbiAgYXN5bmMgaGFuZGxlRXhwb3J0Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5tYXJrZXJzLm1hcChtID0+IG0uc2VyaWFsaXplKCkpLCBudWxsLCAnICAnKTtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgVGV4dEJ1ZmZlcih7dGV4dDoganNvbn0pO1xuICAgIGNvbnN0IHtmaWxlUGF0aH0gPSBhd2FpdCBkaWFsb2cuc2hvd1NhdmVEaWFsb2coe1xuICAgICAgZGVmYXVsdFBhdGg6ICdnaXQtdGltaW5ncy5qc29uJyxcbiAgICB9KTtcbiAgICBpZiAoIWZpbGVQYXRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJ1ZmZlci5zYXZlQXMoZmlsZVBhdGgpO1xuICB9XG59XG5cblxubGV0IG1hcmtlcnMgPSBudWxsO1xubGV0IGdyb3VwSWQgPSAwO1xuY29uc3QgZ3JvdXBzID0gW107XG5sZXQgbGFzdE1hcmtlclRpbWUgPSBudWxsO1xubGV0IHVwZGF0ZVRpbWVyID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0VGltaW5nc1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRpYyB1cmlQYXR0ZXJuID0gJ2F0b20tZ2l0aHViOi8vZGVidWcvdGltaW5ncyc7XG5cbiAgc3RhdGljIGJ1aWxkVVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaVBhdHRlcm47XG4gIH1cblxuICBzdGF0aWMgZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgc3RhdGljIGdlbmVyYXRlTWFya2VyKGxhYmVsKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IE1hcmtlcihsYWJlbCwgKCkgPT4ge1xuICAgICAgR2l0VGltaW5nc1ZpZXcuc2NoZWR1bGVVcGRhdGUoKTtcbiAgICB9KTtcbiAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBpZiAoIW1hcmtlcnMgfHwgKGxhc3RNYXJrZXJUaW1lICYmIE1hdGguYWJzKG5vdyAtIGxhc3RNYXJrZXJUaW1lKSA+PSA1MDAwKSkge1xuICAgICAgZ3JvdXBJZCsrO1xuICAgICAgbWFya2VycyA9IFtdO1xuICAgICAgZ3JvdXBzLnVuc2hpZnQoe2lkOiBncm91cElkLCBtYXJrZXJzfSk7XG4gICAgICBpZiAoZ3JvdXBzLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICBncm91cHMucG9wKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RNYXJrZXJUaW1lID0gbm93O1xuICAgIG1hcmtlcnMucHVzaChtYXJrZXIpO1xuICAgIEdpdFRpbWluZ3NWaWV3LnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfVxuXG4gIHN0YXRpYyByZXN0b3JlR3JvdXAoZ3JvdXApIHtcbiAgICBncm91cElkKys7XG4gICAgZ3JvdXBzLnVuc2hpZnQoe2lkOiBncm91cElkLCBtYXJrZXJzOiBncm91cH0pO1xuICAgIEdpdFRpbWluZ3NWaWV3LnNjaGVkdWxlVXBkYXRlKHRydWUpO1xuICB9XG5cbiAgc3RhdGljIHNjaGVkdWxlVXBkYXRlKGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgaWYgKHVwZGF0ZVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodXBkYXRlVGltZXIpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBHaXRUaW1pbmdzVmlldy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKTtcbiAgICB9LCBpbW1lZGlhdGUgPyAwIDogMTAwMCk7XG4gIH1cblxuICBzdGF0aWMgb25EaWRVcGRhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gR2l0VGltaW5nc1ZpZXcuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVJbXBvcnRDbGljaycpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICBHaXRUaW1pbmdzVmlldy5vbkRpZFVwZGF0ZSgoKSA9PiB0aGlzLmZvcmNlVXBkYXRlKCkpLFxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRUaW1pbmdzVmlld1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRUaW1pbmdzVmlldy1oZWFkZXJcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImltcG9ydC1idXR0b24gYnRuXCIgb25DbGljaz17dGhpcy5oYW5kbGVJbXBvcnRDbGlja30+SW1wb3J0PC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7Z3JvdXBzLm1hcCgoZ3JvdXAsIGlkeCkgPT4gKFxuICAgICAgICAgIDxXYXRlcmZhbGxXaWRnZXQga2V5PXtncm91cC5pZH0gbWFya2Vycz17Z3JvdXAubWFya2Vyc30gLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgYXN5bmMgaGFuZGxlSW1wb3J0Q2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7ZmlsZVBhdGhzfSA9IGF3YWl0IGRpYWxvZy5zaG93T3BlbkRpYWxvZyh7XG4gICAgICBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJ10sXG4gICAgfSk7XG4gICAgaWYgKCFmaWxlUGF0aHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZVBhdGhzWzBdO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVuYW1lLCB7ZW5jb2Rpbmc6ICd1dGY4J30pO1xuICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoY29udGVudHMpO1xuICAgICAgY29uc3QgcmVzdG9yZWRNYXJrZXJzID0gZGF0YS5tYXAoaXRlbSA9PiBNYXJrZXIuZGVzZXJpYWxpemUoaXRlbSkpO1xuICAgICAgR2l0VGltaW5nc1ZpZXcucmVzdG9yZUdyb3VwKHJlc3RvcmVkTWFya2Vycyk7XG4gICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDb3VsZCBub3QgaW1wb3J0IHRpbWluZ3MgZnJvbSAke2ZpbGVuYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnR2l0VGltaW5nc1ZpZXcnLFxuICAgIH07XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuYnVpbGRVUkkoKTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnR2l0SHViIFBhY2thZ2UgVGltaW5ncyBWaWV3JztcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxTQUFBLEdBQUFELE9BQUE7QUFDQSxJQUFBRSxTQUFBLEdBQUFGLE9BQUE7QUFFQSxJQUFBRyxNQUFBLEdBQUFDLHNCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBSyxTQUFBLEdBQUFELHNCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBTSxVQUFBLEdBQUFGLHNCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBTyxPQUFBLEdBQUFILHNCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBUSxRQUFBLEdBQUFKLHNCQUFBLENBQUFKLE9BQUE7QUFFQSxJQUFBUyxRQUFBLEdBQUFMLHNCQUFBLENBQUFKLE9BQUE7QUFDQSxJQUFBVSxRQUFBLEdBQUFWLE9BQUE7QUFBb0MsU0FBQUksdUJBQUFPLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxTQUFBLElBQUFBLFFBQUEsR0FBQUMsTUFBQSxDQUFBQyxNQUFBLEdBQUFELE1BQUEsQ0FBQUMsTUFBQSxDQUFBQyxJQUFBLGVBQUFDLE1BQUEsYUFBQUMsQ0FBQSxNQUFBQSxDQUFBLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxFQUFBRixDQUFBLFVBQUFHLE1BQUEsR0FBQUYsU0FBQSxDQUFBRCxDQUFBLFlBQUFJLEdBQUEsSUFBQUQsTUFBQSxRQUFBUCxNQUFBLENBQUFTLFNBQUEsQ0FBQUMsY0FBQSxDQUFBQyxJQUFBLENBQUFKLE1BQUEsRUFBQUMsR0FBQSxLQUFBTCxNQUFBLENBQUFLLEdBQUEsSUFBQUQsTUFBQSxDQUFBQyxHQUFBLGdCQUFBTCxNQUFBLFlBQUFKLFFBQUEsQ0FBQWEsS0FBQSxPQUFBUCxTQUFBO0FB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