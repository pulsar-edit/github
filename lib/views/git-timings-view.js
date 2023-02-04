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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJkaWFsb2ciLCJyZW1vdGUiLCJnZW5BcnJheSIsIm1lbW9pemUiLCJpbnRlcnZhbCIsImNvdW50IiwiYXJyIiwiaSIsInB1c2giLCJNYXJrZXIiLCJkZXNlcmlhbGl6ZSIsImRhdGEiLCJtYXJrZXIiLCJsYWJlbCIsImVuZCIsIm1hcmtlcnMiLCJjb25zdHJ1Y3RvciIsImRpZFVwZGF0ZSIsImdldFN0YXJ0IiwibGVuZ3RoIiwic3RhcnQiLCJnZXRFbmQiLCJtYXJrIiwic2VjdGlvbk5hbWUiLCJuYW1lIiwicGVyZm9ybWFuY2UiLCJub3ciLCJmaW5hbGl6ZSIsImdldFRpbWluZ3MiLCJtYXAiLCJ0aW1pbmciLCJpZHgiLCJhcnkiLCJuZXh0Iiwic2VyaWFsaXplIiwic2xpY2UiLCJNYXJrZXJUb29sdGlwIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJwcm9wcyIsInRpbWluZ3MiLCJ0ZXh0QWxpZ24iLCJtYXhXaWR0aCIsIndoaXRlU3BhY2UiLCJwYWRkaW5nTGVmdCIsIm1hcmdpblRvcCIsImR1cmF0aW9uIiwiTWF0aCIsImZsb29yIiwiUHJvcFR5cGVzIiwiaW5zdGFuY2VPZiIsImlzUmVxdWlyZWQiLCJDT0xPUlMiLCJxdWV1ZWQiLCJwcmVwYXJlIiwibmV4dHRpY2siLCJleGVjdXRlIiwiaXBjIiwiTWFya2VyU3BhbiIsImF1dG9iaW5kIiwib3RoZXJzIiwidG90YWxUaW1lIiwicGVyY2VudGFnZXMiLCJjb2xvciIsInBlcmNlbnQiLCJjIiwiZWxlbWVudCIsImhhbmRsZU1vdXNlT3ZlciIsImhhbmRsZU1vdXNlT3V0Iiwic3R5bGUiLCJ3aWR0aCIsImJhY2tncm91bmQiLCJlIiwiZWxlbSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIlJlYWN0RG9tIiwidG9vbHRpcERpc3Bvc2FibGUiLCJhdG9tIiwidG9vbHRpcHMiLCJhZGQiLCJpdGVtIiwicGxhY2VtZW50IiwidHJpZ2dlciIsImNsb3NlVG9vbHRpcCIsImRpc3Bvc2UiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsIldhdGVyZmFsbCIsImNvbnRleHQiLCJzdGF0ZSIsImdldE5leHRTdGF0ZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJzZXRTdGF0ZSIsImZpcnN0TWFya2VyIiwibGFzdE1hcmtlciIsInN0YXJ0VGltZSIsImVuZFRpbWUiLCJ0b3RhbER1cmF0aW9uIiwidGltZWxpbmVNYXJrSW50ZXJ2YWwiLCJ6b29tRmFjdG9yIiwidGltZWxpbmVNYXJrcyIsImNlaWwiLCJyZW5kZXJUaW1lTWFya2VycyIsInJlbmRlclRpbWVsaW5lIiwicmVuZGVyTWFya2VyIiwidGltZSIsImxlZnRQb3MiLCJsZWZ0Iiwic3RhcnRPZmZzZXQiLCJtYXJrZXJTdHlsZSIsImFycmF5T2YiLCJudW1iZXIiLCJXYXRlcmZhbGxXaWRnZXQiLCJjb2xsYXBzZWQiLCJoYW5kbGVDb2xsYXBzZUNsaWNrIiwiaGFuZGxlRXhwb3J0Q2xpY2siLCJoYW5kbGVab29tRmFjdG9yQ2hhbmdlIiwicGFyc2VGbG9hdCIsInRhcmdldCIsInZhbHVlIiwicyIsInByZXZlbnREZWZhdWx0IiwianNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJtIiwiYnVmZmVyIiwiVGV4dEJ1ZmZlciIsInRleHQiLCJmaWxlUGF0aCIsInNob3dTYXZlRGlhbG9nIiwiZGVmYXVsdFBhdGgiLCJzYXZlQXMiLCJncm91cElkIiwiZ3JvdXBzIiwibGFzdE1hcmtlclRpbWUiLCJ1cGRhdGVUaW1lciIsIkdpdFRpbWluZ3NWaWV3IiwiYnVpbGRVUkkiLCJ1cmlQYXR0ZXJuIiwiZ2VuZXJhdGVNYXJrZXIiLCJzY2hlZHVsZVVwZGF0ZSIsImFicyIsInVuc2hpZnQiLCJpZCIsInBvcCIsInJlc3RvcmVHcm91cCIsImdyb3VwIiwiaW1tZWRpYXRlIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImVtaXR0ZXIiLCJlbWl0Iiwib25EaWRVcGRhdGUiLCJjYWxsYmFjayIsIm9uIiwiY29tcG9uZW50RGlkTW91bnQiLCJzdWJzY3JpcHRpb25zIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImZvcmNlVXBkYXRlIiwiaGFuZGxlSW1wb3J0Q2xpY2siLCJmaWxlUGF0aHMiLCJzaG93T3BlbkRpYWxvZyIsInByb3BlcnRpZXMiLCJmaWxlbmFtZSIsImNvbnRlbnRzIiwiZnMiLCJyZWFkRmlsZSIsImVuY29kaW5nIiwicGFyc2UiLCJyZXN0b3JlZE1hcmtlcnMiLCJfZXJyIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGVzZXJpYWxpemVyIiwiZ2V0VVJJIiwiZ2V0VGl0bGUiLCJFbWl0dGVyIl0sInNvdXJjZXMiOlsiZ2l0LXRpbWluZ3Mtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHtyZW1vdGV9IGZyb20gJ2VsZWN0cm9uJztcbmNvbnN0IHtkaWFsb2d9ID0gcmVtb3RlO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERvbSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5cbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuY29uc3QgZ2VuQXJyYXkgPSBtZW1vaXplKGZ1bmN0aW9uIGdlbkFycmF5KGludGVydmFsLCBjb3VudCkge1xuICBjb25zdCBhcnIgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gY291bnQ7IGkrKykge1xuICAgIGFyci5wdXNoKGludGVydmFsICogaSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn0sIChpbnRlcnZhbCwgY291bnQpID0+IGAke2ludGVydmFsfToke2NvdW50fWApO1xuXG5jbGFzcyBNYXJrZXIge1xuICBzdGF0aWMgZGVzZXJpYWxpemUoZGF0YSkge1xuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIoZGF0YS5sYWJlbCwgKCkgPT4ge30pO1xuICAgIG1hcmtlci5lbmQgPSBkYXRhLmVuZDtcbiAgICBtYXJrZXIubWFya2VycyA9IGRhdGEubWFya2VycztcbiAgICByZXR1cm4gbWFya2VyO1xuICB9XG5cbiAgY29uc3RydWN0b3IobGFiZWwsIGRpZFVwZGF0ZSkge1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLmRpZFVwZGF0ZSA9IGRpZFVwZGF0ZTtcbiAgICB0aGlzLmVuZCA9IG51bGw7XG4gICAgdGhpcy5tYXJrZXJzID0gW107XG4gIH1cblxuICBnZXRTdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJzLmxlbmd0aCA/IHRoaXMubWFya2Vyc1swXS5zdGFydCA6IG51bGw7XG4gIH1cblxuICBnZXRFbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9XG5cbiAgbWFyayhzZWN0aW9uTmFtZSwgc3RhcnQpIHtcbiAgICB0aGlzLm1hcmtlcnMucHVzaCh7bmFtZTogc2VjdGlvbk5hbWUsIHN0YXJ0OiBzdGFydCB8fCBwZXJmb3JtYW5jZS5ub3coKX0pO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5lbmQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB0aGlzLmRpZFVwZGF0ZSgpO1xuICB9XG5cbiAgZ2V0VGltaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJzLm1hcCgodGltaW5nLCBpZHgsIGFyeSkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IGFyeVtpZHggKyAxXTtcbiAgICAgIGNvbnN0IGVuZCA9IG5leHQgPyBuZXh0LnN0YXJ0IDogdGhpcy5nZXRFbmQoKTtcbiAgICAgIHJldHVybiB7Li4udGltaW5nLCBlbmR9O1xuICAgIH0pO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdGhpcy5sYWJlbCxcbiAgICAgIGVuZDogdGhpcy5lbmQsXG4gICAgICBtYXJrZXJzOiB0aGlzLm1hcmtlcnMuc2xpY2UoKSxcbiAgICB9O1xuICB9XG59XG5cblxuY2xhc3MgTWFya2VyVG9vbHRpcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFya2VyOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcmtlcn0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHRpbWluZ3MgPSBtYXJrZXIuZ2V0VGltaW5ncygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3t0ZXh0QWxpZ246ICdsZWZ0JywgbWF4V2lkdGg6IDMwMCwgd2hpdGVTcGFjZTogJ2luaXRpYWwnfX0+XG4gICAgICAgIDxzdHJvbmc+PHR0PnttYXJrZXIubGFiZWx9PC90dD48L3N0cm9uZz5cbiAgICAgICAgPHVsIHN0eWxlPXt7cGFkZGluZ0xlZnQ6IDIwLCBtYXJnaW5Ub3A6IDEwfX0+XG4gICAgICAgICAge3RpbWluZ3MubWFwKCh7bmFtZSwgc3RhcnQsIGVuZH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kIC0gc3RhcnQ7XG4gICAgICAgICAgICByZXR1cm4gPGxpIGtleT17bmFtZX0+e25hbWV9OiB7TWF0aC5mbG9vcihkdXJhdGlvbiAqIDEwMCkgLyAxMDB9bXM8L2xpPjtcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuY29uc3QgQ09MT1JTID0ge1xuICBxdWV1ZWQ6ICdyZWQnLFxuICBwcmVwYXJlOiAnY3lhbicsXG4gIG5leHR0aWNrOiAneWVsbG93JyxcbiAgZXhlY3V0ZTogJ2dyZWVuJyxcbiAgaXBjOiAncGluaycsXG59O1xuY2xhc3MgTWFya2VyU3BhbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFya2VyOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlTW91c2VPdmVyJywgJ2hhbmRsZU1vdXNlT3V0Jyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcmtlciwgLi4ub3RoZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdGltaW5ncyA9IG1hcmtlci5nZXRUaW1pbmdzKCk7XG4gICAgY29uc3QgdG90YWxUaW1lID0gbWFya2VyLmdldEVuZCgpIC0gbWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgcGVyY2VudGFnZXMgPSB0aW1pbmdzLm1hcCgoe25hbWUsIHN0YXJ0LCBlbmR9KSA9PiB7XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IGVuZCAtIHN0YXJ0O1xuICAgICAgcmV0dXJuIHtjb2xvcjogQ09MT1JTW25hbWVdLCBwZXJjZW50OiBkdXJhdGlvbiAvIHRvdGFsVGltZSAqIDEwMH07XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHsuLi5vdGhlcnN9XG4gICAgICAgIHJlZj17YyA9PiB7IHRoaXMuZWxlbWVudCA9IGM7IH19XG4gICAgICAgIG9uTW91c2VPdmVyPXt0aGlzLmhhbmRsZU1vdXNlT3Zlcn1cbiAgICAgICAgb25Nb3VzZU91dD17dGhpcy5oYW5kbGVNb3VzZU91dH0+XG4gICAgICAgIHtwZXJjZW50YWdlcy5tYXAoKHtjb2xvciwgcGVyY2VudH0sIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBgJHtwZXJjZW50fSVgLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogY29sb3IsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLW1hcmtlci1zZWN0aW9uXCIga2V5PXtpfSBzdHlsZT17c3R5bGV9IC8+O1xuICAgICAgICB9KX1cbiAgICAgIDwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdmVyKGUpIHtcbiAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgUmVhY3REb20ucmVuZGVyKDxNYXJrZXJUb29sdGlwIG1hcmtlcj17dGhpcy5wcm9wcy5tYXJrZXJ9IC8+LCBlbGVtKTtcbiAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICBpdGVtOiBlbGVtLFxuICAgICAgcGxhY2VtZW50OiAnYXV0byBib3R0b20nLFxuICAgICAgdHJpZ2dlcjogJ21hbnVhbCcsXG4gICAgfSk7XG4gIH1cblxuICBjbG9zZVRvb2x0aXAoKSB7XG4gICAgdGhpcy50b29sdGlwRGlzcG9zYWJsZSAmJiB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0KGUpIHtcbiAgICB0aGlzLmNsb3NlVG9vbHRpcCgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5jbG9zZVRvb2x0aXAoKTtcbiAgfVxufVxuXG5cbmNsYXNzIFdhdGVyZmFsbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFya2VyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmluc3RhbmNlT2YoTWFya2VyKSkuaXNSZXF1aXJlZCxcbiAgICB6b29tRmFjdG9yOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcbiAgICBhdXRvYmluZCh0aGlzLCAncmVuZGVyTWFya2VyJyk7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0TmV4dFN0YXRlKHByb3BzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldE5leHRTdGF0ZShuZXh0UHJvcHMpKTtcbiAgfVxuXG4gIGdldE5leHRTdGF0ZShwcm9wcykge1xuICAgIGNvbnN0IHttYXJrZXJzfSA9IHByb3BzO1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gbWFya2Vyc1swXTtcbiAgICBjb25zdCBsYXN0TWFya2VyID0gbWFya2Vyc1ttYXJrZXJzLmxlbmd0aCAtIDFdO1xuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gZmlyc3RNYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBlbmRUaW1lID0gbGFzdE1hcmtlci5nZXRFbmQoKTtcbiAgICBjb25zdCB0b3RhbER1cmF0aW9uID0gZW5kVGltZSAtIHN0YXJ0VGltZTtcbiAgICBsZXQgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSBudWxsO1xuICAgIGlmIChwcm9wcy56b29tRmFjdG9yIDw9IDAuMTUpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gMTAwMDtcbiAgICB9IGVsc2UgaWYgKHByb3BzLnpvb21GYWN0b3IgPD0gMC4zKSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDUwMDtcbiAgICB9IGVsc2UgaWYgKHByb3BzLnpvb21GYWN0b3IgPD0gMC42KSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDI1MDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSAxMDA7XG4gICAgfVxuICAgIGNvbnN0IHRpbWVsaW5lTWFya3MgPSBnZW5BcnJheSh0aW1lbGluZU1hcmtJbnRlcnZhbCwgTWF0aC5jZWlsKHRvdGFsRHVyYXRpb24gLyB0aW1lbGluZU1hcmtJbnRlcnZhbCkpO1xuXG4gICAgcmV0dXJuIHtmaXJzdE1hcmtlciwgbGFzdE1hcmtlciwgc3RhcnRUaW1lLCBlbmRUaW1lLCB0b3RhbER1cmF0aW9uLCB0aW1lbGluZU1hcmtzfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtc2Nyb2xsZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyVGltZU1hcmtlcnMoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZSgpfVxuICAgICAgICAgIHt0aGlzLnByb3BzLm1hcmtlcnMubWFwKHRoaXMucmVuZGVyTWFya2VyKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGltZWxpbmUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXRpbWVsaW5lXCI+XG4gICAgICAgICZuYnNwO1xuICAgICAgICB7dGhpcy5zdGF0ZS50aW1lbGluZU1hcmtzLm1hcCh0aW1lID0+IHtcbiAgICAgICAgICBjb25zdCBsZWZ0UG9zID0gdGltZSAqIHRoaXMucHJvcHMuem9vbUZhY3RvcjtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXRpbWVsaW5lLWxhYmVsXCIgc3R5bGU9e3N0eWxlfSBrZXk9e2B0bDoke3RpbWV9YH0+e3RpbWV9bXM8L3NwYW4+O1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaW1lTWFya2VycygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZS1tYXJrZXJzXCI+XG4gICAgICAgIHt0aGlzLnN0YXRlLnRpbWVsaW5lTWFya3MubWFwKHRpbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGxlZnRQb3MgPSB0aW1lICogdGhpcy5wcm9wcy56b29tRmFjdG9yO1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgbGVmdDogbGVmdFBvcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZS1tYXJrZXJcIiBzdHlsZT17c3R5bGV9IGtleT17YHRtOiR7dGltZX1gfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyTWFya2VyKG1hcmtlciwgaSkge1xuICAgIGlmIChtYXJrZXIuZ2V0U3RhcnQoKSA9PT0gbnVsbCB8fCBtYXJrZXIuZ2V0RW5kKCkgPT09IG51bGwpIHsgcmV0dXJuIDxkaXYga2V5PXtpfSAvPjsgfVxuXG4gICAgY29uc3Qgc3RhcnRPZmZzZXQgPSBtYXJrZXIuZ2V0U3RhcnQoKSAtIHRoaXMuc3RhdGUuc3RhcnRUaW1lO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbWFya2VyLmdldEVuZCgpIC0gbWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgbWFya2VyU3R5bGUgPSB7XG4gICAgICBsZWZ0OiBzdGFydE9mZnNldCAqIHRoaXMucHJvcHMuem9vbUZhY3RvcixcbiAgICAgIHdpZHRoOiBkdXJhdGlvbiAqIHRoaXMucHJvcHMuem9vbUZhY3RvcixcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXJvd1wiIGtleT17aX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXJvdy1sYWJlbFwiXG4gICAgICAgICAgc3R5bGU9e3twYWRkaW5nTGVmdDogbWFya2VyU3R5bGUubGVmdCArIG1hcmtlclN0eWxlLndpZHRofX0+e21hcmtlci5sYWJlbH08L3NwYW4+XG4gICAgICAgIDxNYXJrZXJTcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC1tYXJrZXJcIiBzdHlsZT17bWFya2VyU3R5bGV9IG1hcmtlcj17bWFya2VyfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5cbmNsYXNzIFdhdGVyZmFsbFdpZGdldCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFya2VyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmluc3RhbmNlT2YoTWFya2VyKSkuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVab29tRmFjdG9yQ2hhbmdlJywgJ2hhbmRsZUNvbGxhcHNlQ2xpY2snLCAnaGFuZGxlRXhwb3J0Q2xpY2snKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgem9vbUZhY3RvcjogMC4zLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttYXJrZXJzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSBtYXJrZXJzWzBdO1xuICAgIGNvbnN0IGxhc3RNYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV07XG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBmaXJzdE1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsYXN0TWFya2VyLmdldEVuZCgpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kVGltZSAtIHN0YXJ0VGltZTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC13aWRnZXQgaW5zZXQtcGFubmVsXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWhlYWRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWhlYWRlci10ZXh0XCI+XG4gICAgICAgICAgICA8c3BhbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNvbGxhcHNlQ2xpY2t9IGNsYXNzTmFtZT1cImNvbGxhcHNlLXRvZ2dsZVwiPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5jb2xsYXBzZWQgPyAnXFx1MjViNicgOiAnXFx1MjViYyd9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5tYXJrZXJzLmxlbmd0aH0gZXZlbnQocykgb3ZlciB7TWF0aC5mbG9vcihkdXJhdGlvbil9bXNcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1oZWFkZXItY29udHJvbHNcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWV4cG9ydC1idXR0b24gYnRuIGJ0bi1zbVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRXhwb3J0Q2xpY2t9PkV4cG9ydDwvYnV0dG9uPlxuICAgICAgICAgICAgPE9jdGljb24gaWNvbj1cInNlYXJjaFwiIC8+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtcmFuZ2VcIlxuICAgICAgICAgICAgICBtaW49ezAuMX1cbiAgICAgICAgICAgICAgbWF4PXsxfVxuICAgICAgICAgICAgICBzdGVwPXswLjAxfVxuICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS56b29tRmFjdG9yfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVab29tRmFjdG9yQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnN0YXRlLmNvbGxhcHNlZCA/IG51bGwgOiA8V2F0ZXJmYWxsIG1hcmtlcnM9e3RoaXMucHJvcHMubWFya2Vyc30gem9vbUZhY3Rvcj17dGhpcy5zdGF0ZS56b29tRmFjdG9yfSAvPn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVab29tRmFjdG9yQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt6b29tRmFjdG9yOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKX0pO1xuICB9XG5cbiAgaGFuZGxlQ29sbGFwc2VDbGljayhlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShzID0+ICh7Y29sbGFwc2VkOiAhcy5jb2xsYXBzZWR9KSk7XG4gIH1cblxuICBhc3luYyBoYW5kbGVFeHBvcnRDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLm1hcmtlcnMubWFwKG0gPT4gbS5zZXJpYWxpemUoKSksIG51bGwsICcgICcpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKHt0ZXh0OiBqc29ufSk7XG4gICAgY29uc3Qge2ZpbGVQYXRofSA9IGF3YWl0IGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XG4gICAgICBkZWZhdWx0UGF0aDogJ2dpdC10aW1pbmdzLmpzb24nLFxuICAgIH0pO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYnVmZmVyLnNhdmVBcyhmaWxlUGF0aCk7XG4gIH1cbn1cblxuXG5sZXQgbWFya2VycyA9IG51bGw7XG5sZXQgZ3JvdXBJZCA9IDA7XG5jb25zdCBncm91cHMgPSBbXTtcbmxldCBsYXN0TWFya2VyVGltZSA9IG51bGw7XG5sZXQgdXBkYXRlVGltZXIgPSBudWxsO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRUaW1pbmdzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgc3RhdGljIHVyaVBhdHRlcm4gPSAnYXRvbS1naXRodWI6Ly9kZWJ1Zy90aW1pbmdzJztcblxuICBzdGF0aWMgYnVpbGRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJpUGF0dGVybjtcbiAgfVxuXG4gIHN0YXRpYyBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICBzdGF0aWMgZ2VuZXJhdGVNYXJrZXIobGFiZWwpIHtcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgTWFya2VyKGxhYmVsLCAoKSA9PiB7XG4gICAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgIH0pO1xuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIGlmICghbWFya2VycyB8fCAobGFzdE1hcmtlclRpbWUgJiYgTWF0aC5hYnMobm93IC0gbGFzdE1hcmtlclRpbWUpID49IDUwMDApKSB7XG4gICAgICBncm91cElkKys7XG4gICAgICBtYXJrZXJzID0gW107XG4gICAgICBncm91cHMudW5zaGlmdCh7aWQ6IGdyb3VwSWQsIG1hcmtlcnN9KTtcbiAgICAgIGlmIChncm91cHMubGVuZ3RoID4gMTAwKSB7XG4gICAgICAgIGdyb3Vwcy5wb3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdE1hcmtlclRpbWUgPSBub3c7XG4gICAgbWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgR2l0VGltaW5nc1ZpZXcuc2NoZWR1bGVVcGRhdGUoKTtcbiAgICByZXR1cm4gbWFya2VyO1xuICB9XG5cbiAgc3RhdGljIHJlc3RvcmVHcm91cChncm91cCkge1xuICAgIGdyb3VwSWQrKztcbiAgICBncm91cHMudW5zaGlmdCh7aWQ6IGdyb3VwSWQsIG1hcmtlcnM6IGdyb3VwfSk7XG4gICAgR2l0VGltaW5nc1ZpZXcuc2NoZWR1bGVVcGRhdGUodHJ1ZSk7XG4gIH1cblxuICBzdGF0aWMgc2NoZWR1bGVVcGRhdGUoaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBpZiAodXBkYXRlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh1cGRhdGVUaW1lcik7XG4gICAgfVxuXG4gICAgdXBkYXRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpO1xuICAgIH0sIGltbWVkaWF0ZSA/IDAgOiAxMDAwKTtcbiAgfVxuXG4gIHN0YXRpYyBvbkRpZFVwZGF0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiBHaXRUaW1pbmdzVmlldy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUltcG9ydENsaWNrJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIEdpdFRpbWluZ3NWaWV3Lm9uRGlkVXBkYXRlKCgpID0+IHRoaXMuZm9yY2VVcGRhdGUoKSksXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdFRpbWluZ3NWaWV3XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdFRpbWluZ3NWaWV3LWhlYWRlclwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaW1wb3J0LWJ1dHRvbiBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUltcG9ydENsaWNrfT5JbXBvcnQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtncm91cHMubWFwKChncm91cCwgaWR4KSA9PiAoXG4gICAgICAgICAgPFdhdGVyZmFsbFdpZGdldCBrZXk9e2dyb3VwLmlkfSBtYXJrZXJzPXtncm91cC5tYXJrZXJzfSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBhc3luYyBoYW5kbGVJbXBvcnRDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHtmaWxlUGF0aHN9ID0gYXdhaXQgZGlhbG9nLnNob3dPcGVuRGlhbG9nKHtcbiAgICAgIHByb3BlcnRpZXM6IFsnb3BlbkZpbGUnXSxcbiAgICB9KTtcbiAgICBpZiAoIWZpbGVQYXRocy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlUGF0aHNbMF07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZW5hbWUsIHtlbmNvZGluZzogJ3V0ZjgnfSk7XG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShjb250ZW50cyk7XG4gICAgICBjb25zdCByZXN0b3JlZE1hcmtlcnMgPSBkYXRhLm1hcChpdGVtID0+IE1hcmtlci5kZXNlcmlhbGl6ZShpdGVtKSk7XG4gICAgICBHaXRUaW1pbmdzVmlldy5yZXN0b3JlR3JvdXAocmVzdG9yZWRNYXJrZXJzKTtcbiAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYENvdWxkIG5vdCBpbXBvcnQgdGltaW5ncyBmcm9tICR7ZmlsZW5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdHaXRUaW1pbmdzVmlldycsXG4gICAgfTtcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5idWlsZFVSSSgpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdHaXRIdWIgUGFja2FnZSBUaW1pbmdzIFZpZXcnO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQW9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVJwQyxNQUFNO0VBQUNBO0FBQU0sQ0FBQyxHQUFHQyxnQkFBTTtBQVV2QixNQUFNQyxRQUFRLEdBQUcsSUFBQUMsZUFBTyxFQUFDLFNBQVNELFFBQVEsQ0FBQ0UsUUFBUSxFQUFFQyxLQUFLLEVBQUU7RUFDMUQsTUFBTUMsR0FBRyxHQUFHLEVBQUU7RUFDZCxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSUYsS0FBSyxFQUFFRSxDQUFDLEVBQUUsRUFBRTtJQUMvQkQsR0FBRyxDQUFDRSxJQUFJLENBQUNKLFFBQVEsR0FBR0csQ0FBQyxDQUFDO0VBQ3hCO0VBQ0EsT0FBT0QsR0FBRztBQUNaLENBQUMsRUFBRSxDQUFDRixRQUFRLEVBQUVDLEtBQUssS0FBTSxHQUFFRCxRQUFTLElBQUdDLEtBQU0sRUFBQyxDQUFDO0FBRS9DLE1BQU1JLE1BQU0sQ0FBQztFQUNYLE9BQU9DLFdBQVcsQ0FBQ0MsSUFBSSxFQUFFO0lBQ3ZCLE1BQU1DLE1BQU0sR0FBRyxJQUFJSCxNQUFNLENBQUNFLElBQUksQ0FBQ0UsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0NELE1BQU0sQ0FBQ0UsR0FBRyxHQUFHSCxJQUFJLENBQUNHLEdBQUc7SUFDckJGLE1BQU0sQ0FBQ0csT0FBTyxHQUFHSixJQUFJLENBQUNJLE9BQU87SUFDN0IsT0FBT0gsTUFBTTtFQUNmO0VBRUFJLFdBQVcsQ0FBQ0gsS0FBSyxFQUFFSSxTQUFTLEVBQUU7SUFDNUIsSUFB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