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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXQtdGltaW5ncy12aWV3LmpzIl0sIm5hbWVzIjpbImRpYWxvZyIsInJlbW90ZSIsImdlbkFycmF5IiwiaW50ZXJ2YWwiLCJjb3VudCIsImFyciIsImkiLCJwdXNoIiwiTWFya2VyIiwiZGVzZXJpYWxpemUiLCJkYXRhIiwibWFya2VyIiwibGFiZWwiLCJlbmQiLCJtYXJrZXJzIiwiY29uc3RydWN0b3IiLCJkaWRVcGRhdGUiLCJnZXRTdGFydCIsImxlbmd0aCIsInN0YXJ0IiwiZ2V0RW5kIiwibWFyayIsInNlY3Rpb25OYW1lIiwibmFtZSIsInBlcmZvcm1hbmNlIiwibm93IiwiZmluYWxpemUiLCJnZXRUaW1pbmdzIiwibWFwIiwidGltaW5nIiwiaWR4IiwiYXJ5IiwibmV4dCIsInNlcmlhbGl6ZSIsInNsaWNlIiwiTWFya2VyVG9vbHRpcCIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJ0aW1pbmdzIiwidGV4dEFsaWduIiwibWF4V2lkdGgiLCJ3aGl0ZVNwYWNlIiwicGFkZGluZ0xlZnQiLCJtYXJnaW5Ub3AiLCJkdXJhdGlvbiIsIk1hdGgiLCJmbG9vciIsIlByb3BUeXBlcyIsImluc3RhbmNlT2YiLCJpc1JlcXVpcmVkIiwiQ09MT1JTIiwicXVldWVkIiwicHJlcGFyZSIsIm5leHR0aWNrIiwiZXhlY3V0ZSIsImlwYyIsIk1hcmtlclNwYW4iLCJvdGhlcnMiLCJ0b3RhbFRpbWUiLCJwZXJjZW50YWdlcyIsImNvbG9yIiwicGVyY2VudCIsImMiLCJlbGVtZW50IiwiaGFuZGxlTW91c2VPdmVyIiwiaGFuZGxlTW91c2VPdXQiLCJzdHlsZSIsIndpZHRoIiwiYmFja2dyb3VuZCIsImUiLCJlbGVtIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiUmVhY3REb20iLCJ0b29sdGlwRGlzcG9zYWJsZSIsImF0b20iLCJ0b29sdGlwcyIsImFkZCIsIml0ZW0iLCJwbGFjZW1lbnQiLCJ0cmlnZ2VyIiwiY2xvc2VUb29sdGlwIiwiZGlzcG9zZSIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiV2F0ZXJmYWxsIiwiY29udGV4dCIsInN0YXRlIiwiZ2V0TmV4dFN0YXRlIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwiZmlyc3RNYXJrZXIiLCJsYXN0TWFya2VyIiwic3RhcnRUaW1lIiwiZW5kVGltZSIsInRvdGFsRHVyYXRpb24iLCJ0aW1lbGluZU1hcmtJbnRlcnZhbCIsInpvb21GYWN0b3IiLCJ0aW1lbGluZU1hcmtzIiwiY2VpbCIsInJlbmRlclRpbWVNYXJrZXJzIiwicmVuZGVyVGltZWxpbmUiLCJyZW5kZXJNYXJrZXIiLCJ0aW1lIiwibGVmdFBvcyIsImxlZnQiLCJzdGFydE9mZnNldCIsIm1hcmtlclN0eWxlIiwiYXJyYXlPZiIsIm51bWJlciIsIldhdGVyZmFsbFdpZGdldCIsImNvbGxhcHNlZCIsImhhbmRsZUNvbGxhcHNlQ2xpY2siLCJoYW5kbGVFeHBvcnRDbGljayIsImhhbmRsZVpvb21GYWN0b3JDaGFuZ2UiLCJwYXJzZUZsb2F0IiwidGFyZ2V0IiwidmFsdWUiLCJzIiwicHJldmVudERlZmF1bHQiLCJqc29uIiwiSlNPTiIsInN0cmluZ2lmeSIsIm0iLCJidWZmZXIiLCJUZXh0QnVmZmVyIiwidGV4dCIsImZpbGVQYXRoIiwic2hvd1NhdmVEaWFsb2ciLCJkZWZhdWx0UGF0aCIsInNhdmVBcyIsImdyb3VwSWQiLCJncm91cHMiLCJsYXN0TWFya2VyVGltZSIsInVwZGF0ZVRpbWVyIiwiR2l0VGltaW5nc1ZpZXciLCJidWlsZFVSSSIsInVyaVBhdHRlcm4iLCJnZW5lcmF0ZU1hcmtlciIsInNjaGVkdWxlVXBkYXRlIiwiYWJzIiwidW5zaGlmdCIsImlkIiwicG9wIiwicmVzdG9yZUdyb3VwIiwiZ3JvdXAiLCJpbW1lZGlhdGUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZW1pdHRlciIsImVtaXQiLCJvbkRpZFVwZGF0ZSIsImNhbGxiYWNrIiwib24iLCJjb21wb25lbnREaWRNb3VudCIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZm9yY2VVcGRhdGUiLCJoYW5kbGVJbXBvcnRDbGljayIsImZpbGVQYXRocyIsInNob3dPcGVuRGlhbG9nIiwicHJvcGVydGllcyIsImZpbGVuYW1lIiwiY29udGVudHMiLCJmcyIsInJlYWRGaWxlIiwiZW5jb2RpbmciLCJwYXJzZSIsInJlc3RvcmVkTWFya2VycyIsIl9lcnIiLCJub3RpZmljYXRpb25zIiwiYWRkRXJyb3IiLCJkZXNlcmlhbGl6ZXIiLCJnZXRVUkkiLCJnZXRUaXRsZSIsIkVtaXR0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQVJBLE1BQU07QUFBQ0EsRUFBQUE7QUFBRCxJQUFXQyxnQkFBakI7QUFVQSxNQUFNQyxRQUFRLEdBQUcscUJBQVEsU0FBU0EsUUFBVCxDQUFrQkMsUUFBbEIsRUFBNEJDLEtBQTVCLEVBQW1DO0FBQzFELFFBQU1DLEdBQUcsR0FBRyxFQUFaOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSUYsS0FBckIsRUFBNEJFLENBQUMsRUFBN0IsRUFBaUM7QUFDL0JELElBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTSixRQUFRLEdBQUdHLENBQXBCO0FBQ0Q7O0FBQ0QsU0FBT0QsR0FBUDtBQUNELENBTmdCLEVBTWQsQ0FBQ0YsUUFBRCxFQUFXQyxLQUFYLEtBQXNCLEdBQUVELFFBQVMsSUFBR0MsS0FBTSxFQU41QixDQUFqQjs7QUFRQSxNQUFNSSxNQUFOLENBQWE7QUFDTyxTQUFYQyxXQUFXLENBQUNDLElBQUQsRUFBTztBQUN2QixVQUFNQyxNQUFNLEdBQUcsSUFBSUgsTUFBSixDQUFXRSxJQUFJLENBQUNFLEtBQWhCLEVBQXVCLE1BQU0sQ0FBRSxDQUEvQixDQUFmO0FB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QUFFO0FBQVgsT0FBdEIsQ0FBdkI7QUFDQSxZQUFNOUosSUFBSSxHQUFHaUgsSUFBSSxDQUFDOEMsS0FBTCxDQUFXSixRQUFYLENBQWI7QUFDQSxZQUFNSyxlQUFlLEdBQUdoSyxJQUFJLENBQUNrQixHQUFMLENBQVNvRCxJQUFJLElBQUl4RSxNQUFNLENBQUNDLFdBQVAsQ0FBbUJ1RSxJQUFuQixDQUFqQixDQUF4QjtBQUNBeUQsTUFBQUEsY0FBYyxDQUFDUyxZQUFmLENBQTRCd0IsZUFBNUI7QUFDRCxLQUxELENBS0UsT0FBT0MsSUFBUCxFQUFhO0FBQ2I5RixNQUFBQSxJQUFJLENBQUMrRixhQUFMLENBQW1CQyxRQUFuQixDQUE2QixpQ0FBZ0NULFFBQVMsRUFBdEU7QUFDRDtBQUNGOztBQUVEbkksRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTztBQUNMNkksTUFBQUEsWUFBWSxFQUFFO0FBRFQsS0FBUDtBQUdEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUFPLEtBQUtoSyxXQUFMLENBQWlCMkgsUUFBakIsRUFBUDtBQUNEOztBQUVEc0MsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyw2QkFBUDtBQUNEOztBQTVHeUQ7Ozs7Z0JBQXZDdkMsYyxnQkFFQyw2Qjs7Z0JBRkRBLGMsYUFRRixJQUFJd0MsaUJBQUosRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEJ1ZmZlcn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQge3JlbW90ZX0gZnJvbSAnZWxlY3Ryb24nO1xuY29uc3Qge2RpYWxvZ30gPSByZW1vdGU7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RG9tIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBnZW5BcnJheSA9IG1lbW9pemUoZnVuY3Rpb24gZ2VuQXJyYXkoaW50ZXJ2YWwsIGNvdW50KSB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSBjb3VudDsgaSsrKSB7XG4gICAgYXJyLnB1c2goaW50ZXJ2YWwgKiBpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufSwgKGludGVydmFsLCBjb3VudCkgPT4gYCR7aW50ZXJ2YWx9OiR7Y291bnR9YCk7XG5cbmNsYXNzIE1hcmtlciB7XG4gIHN0YXRpYyBkZXNlcmlhbGl6ZShkYXRhKSB7XG4gICAgY29uc3QgbWFya2VyID0gbmV3IE1hcmtlcihkYXRhLmxhYmVsLCAoKSA9PiB7fSk7XG4gICAgbWFya2VyLmVuZCA9IGRhdGEuZW5kO1xuICAgIG1hcmtlci5tYXJrZXJzID0gZGF0YS5tYXJrZXJzO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihsYWJlbCwgZGlkVXBkYXRlKSB7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMuZGlkVXBkYXRlID0gZGlkVXBkYXRlO1xuICAgIHRoaXMuZW5kID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgfVxuXG4gIGdldFN0YXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubGVuZ3RoID8gdGhpcy5tYXJrZXJzWzBdLnN0YXJ0IDogbnVsbDtcbiAgfVxuXG4gIGdldEVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH1cblxuICBtYXJrKHNlY3Rpb25OYW1lLCBzdGFydCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHtuYW1lOiBzZWN0aW9uTmFtZSwgc3RhcnQ6IHN0YXJ0IHx8IHBlcmZvcm1hbmNlLm5vdygpfSk7XG4gIH1cblxuICBmaW5hbGl6ZSgpIHtcbiAgICB0aGlzLmVuZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMuZGlkVXBkYXRlKCk7XG4gIH1cblxuICBnZXRUaW1pbmdzKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnMubWFwKCh0aW1pbmcsIGlkeCwgYXJ5KSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gYXJ5W2lkeCArIDFdO1xuICAgICAgY29uc3QgZW5kID0gbmV4dCA/IG5leHQuc3RhcnQgOiB0aGlzLmdldEVuZCgpO1xuICAgICAgcmV0dXJuIHsuLi50aW1pbmcsIGVuZH07XG4gICAgfSk7XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgZW5kOiB0aGlzLmVuZCxcbiAgICAgIG1hcmtlcnM6IHRoaXMubWFya2Vycy5zbGljZSgpLFxuICAgIH07XG4gIH1cbn1cblxuXG5jbGFzcyBNYXJrZXJUb29sdGlwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgdGltaW5ncyA9IG1hcmtlci5nZXRUaW1pbmdzKCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e3RleHRBbGlnbjogJ2xlZnQnLCBtYXhXaWR0aDogMzAwLCB3aGl0ZVNwYWNlOiAnaW5pdGlhbCd9fT5cbiAgICAgICAgPHN0cm9uZz48dHQ+e21hcmtlci5sYWJlbH08L3R0Pjwvc3Ryb25nPlxuICAgICAgICA8dWwgc3R5bGU9e3twYWRkaW5nTGVmdDogMjAsIG1hcmdpblRvcDogMTB9fT5cbiAgICAgICAgICB7dGltaW5ncy5tYXAoKHtuYW1lLCBzdGFydCwgZW5kfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBlbmQgLSBzdGFydDtcbiAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtuYW1lfT57bmFtZX06IHtNYXRoLmZsb29yKGR1cmF0aW9uICogMTAwKSAvIDEwMH1tczwvbGk+O1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBDT0xPUlMgPSB7XG4gIHF1ZXVlZDogJ3JlZCcsXG4gIHByZXBhcmU6ICdjeWFuJyxcbiAgbmV4dHRpY2s6ICd5ZWxsb3cnLFxuICBleGVjdXRlOiAnZ3JlZW4nLFxuICBpcGM6ICdwaW5rJyxcbn07XG5jbGFzcyBNYXJrZXJTcGFuIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXI6IFByb3BUeXBlcy5pbnN0YW5jZU9mKE1hcmtlcikuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVNb3VzZU92ZXInLCAnaGFuZGxlTW91c2VPdXQnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7bWFya2VyLCAuLi5vdGhlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB0aW1pbmdzID0gbWFya2VyLmdldFRpbWluZ3MoKTtcbiAgICBjb25zdCB0b3RhbFRpbWUgPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBwZXJjZW50YWdlcyA9IHRpbWluZ3MubWFwKCh7bmFtZSwgc3RhcnQsIGVuZH0pID0+IHtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kIC0gc3RhcnQ7XG4gICAgICByZXR1cm4ge2NvbG9yOiBDT0xPUlNbbmFtZV0sIHBlcmNlbnQ6IGR1cmF0aW9uIC8gdG90YWxUaW1lICogMTAwfTtcbiAgICB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgey4uLm90aGVyc31cbiAgICAgICAgcmVmPXtjID0+IHsgdGhpcy5lbGVtZW50ID0gYzsgfX1cbiAgICAgICAgb25Nb3VzZU92ZXI9e3RoaXMuaGFuZGxlTW91c2VPdmVyfVxuICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0fT5cbiAgICAgICAge3BlcmNlbnRhZ2VzLm1hcCgoe2NvbG9yLCBwZXJjZW50fSwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgd2lkdGg6IGAke3BlcmNlbnR9JWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvcixcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtbWFya2VyLXNlY3Rpb25cIiBrZXk9e2l9IHN0eWxlPXtzdHlsZX0gLz47XG4gICAgICAgIH0pfVxuICAgICAgPC9zcGFuPlxuICAgICk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU92ZXIoZSkge1xuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBSZWFjdERvbS5yZW5kZXIoPE1hcmtlclRvb2x0aXAgbWFya2VyPXt0aGlzLnByb3BzLm1hcmtlcn0gLz4sIGVsZW0pO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIGl0ZW06IGVsZW0sXG4gICAgICBwbGFjZW1lbnQ6ICdhdXRvIGJvdHRvbScsXG4gICAgICB0cmlnZ2VyOiAnbWFudWFsJyxcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlVG9vbHRpcCgpIHtcbiAgICB0aGlzLnRvb2x0aXBEaXNwb3NhYmxlICYmIHRoaXMudG9vbHRpcERpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgIHRoaXMudG9vbHRpcERpc3Bvc2FibGUgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlTW91c2VPdXQoZSkge1xuICAgIHRoaXMuY2xvc2VUb29sdGlwKCk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNsb3NlVG9vbHRpcCgpO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICAgIHpvb21GYWN0b3I6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZW5kZXJNYXJrZXInKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXROZXh0U3RhdGUocHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0TmV4dFN0YXRlKG5leHRQcm9wcykpO1xuICB9XG5cbiAgZ2V0TmV4dFN0YXRlKHByb3BzKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gcHJvcHM7XG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSBtYXJrZXJzWzBdO1xuICAgIGNvbnN0IGxhc3RNYXJrZXIgPSBtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV07XG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBmaXJzdE1hcmtlci5nZXRTdGFydCgpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBsYXN0TWFya2VyLmdldEVuZCgpO1xuICAgIGNvbnN0IHRvdGFsRHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuICAgIGxldCB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IG51bGw7XG4gICAgaWYgKHByb3BzLnpvb21GYWN0b3IgPD0gMC4xNSkge1xuICAgICAgdGltZWxpbmVNYXJrSW50ZXJ2YWwgPSAxMDAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjMpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gNTAwO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuem9vbUZhY3RvciA8PSAwLjYpIHtcbiAgICAgIHRpbWVsaW5lTWFya0ludGVydmFsID0gMjUwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lbGluZU1hcmtJbnRlcnZhbCA9IDEwMDtcbiAgICB9XG4gICAgY29uc3QgdGltZWxpbmVNYXJrcyA9IGdlbkFycmF5KHRpbWVsaW5lTWFya0ludGVydmFsLCBNYXRoLmNlaWwodG90YWxEdXJhdGlvbiAvIHRpbWVsaW5lTWFya0ludGVydmFsKSk7XG5cbiAgICByZXR1cm4ge2ZpcnN0TWFya2VyLCBsYXN0TWFya2VyLCBzdGFydFRpbWUsIGVuZFRpbWUsIHRvdGFsRHVyYXRpb24sIHRpbWVsaW5lTWFya3N9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1zY3JvbGxlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJUaW1lTWFya2VycygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lKCl9XG4gICAgICAgICAge3RoaXMucHJvcHMubWFya2Vycy5tYXAodGhpcy5yZW5kZXJNYXJrZXIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmVcIj5cbiAgICAgICAgJm5ic3A7XG4gICAgICAgIHt0aGlzLnN0YXRlLnRpbWVsaW5lTWFya3MubWFwKHRpbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IGxlZnRQb3MgPSB0aW1lICogdGhpcy5wcm9wcy56b29tRmFjdG9yO1xuICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xuICAgICAgICAgICAgbGVmdDogbGVmdFBvcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiA8c3BhbiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtdGltZWxpbmUtbGFiZWxcIiBzdHlsZT17c3R5bGV9IGtleT17YHRsOiR7dGltZX1gfT57dGltZX1tczwvc3Bhbj47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRpbWVNYXJrZXJzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlcnNcIj5cbiAgICAgICAge3RoaXMuc3RhdGUudGltZWxpbmVNYXJrcy5tYXAodGltZSA9PiB7XG4gICAgICAgICAgY29uc3QgbGVmdFBvcyA9IHRpbWUgKiB0aGlzLnByb3BzLnpvb21GYWN0b3I7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICAgICAgICBsZWZ0OiBsZWZ0UG9zLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIndhdGVyZmFsbC10aW1lLW1hcmtlclwiIHN0eWxlPXtzdHlsZX0ga2V5PXtgdG06JHt0aW1lfWB9IC8+O1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJNYXJrZXIobWFya2VyLCBpKSB7XG4gICAgaWYgKG1hcmtlci5nZXRTdGFydCgpID09PSBudWxsIHx8IG1hcmtlci5nZXRFbmQoKSA9PT0gbnVsbCkgeyByZXR1cm4gPGRpdiBrZXk9e2l9IC8+OyB9XG5cbiAgICBjb25zdCBzdGFydE9mZnNldCA9IG1hcmtlci5nZXRTdGFydCgpIC0gdGhpcy5zdGF0ZS5zdGFydFRpbWU7XG4gICAgY29uc3QgZHVyYXRpb24gPSBtYXJrZXIuZ2V0RW5kKCkgLSBtYXJrZXIuZ2V0U3RhcnQoKTtcbiAgICBjb25zdCBtYXJrZXJTdHlsZSA9IHtcbiAgICAgIGxlZnQ6IHN0YXJ0T2Zmc2V0ICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgICAgd2lkdGg6IGR1cmF0aW9uICogdGhpcy5wcm9wcy56b29tRmFjdG9yLFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93XCIga2V5PXtpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtcm93LWxhYmVsXCJcbiAgICAgICAgICBzdHlsZT17e3BhZGRpbmdMZWZ0OiBtYXJrZXJTdHlsZS5sZWZ0ICsgbWFya2VyU3R5bGUud2lkdGh9fT57bWFya2VyLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgPE1hcmtlclNwYW4gY2xhc3NOYW1lPVwid2F0ZXJmYWxsLW1hcmtlclwiIHN0eWxlPXttYXJrZXJTdHlsZX0gbWFya2VyPXttYXJrZXJ9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblxuY2xhc3MgV2F0ZXJmYWxsV2lkZ2V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtYXJrZXJzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXJrZXIpKS5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZVpvb21GYWN0b3JDaGFuZ2UnLCAnaGFuZGxlQ29sbGFwc2VDbGljaycsICdoYW5kbGVFeHBvcnRDbGljaycpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB6b29tRmFjdG9yOiAwLjMsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21hcmtlcnN9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IG1hcmtlcnNbMF07XG4gICAgY29uc3QgbGFzdE1hcmtlciA9IG1hcmtlcnNbbWFya2Vycy5sZW5ndGggLSAxXTtcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IGZpcnN0TWFya2VyLmdldFN0YXJ0KCk7XG4gICAgY29uc3QgZW5kVGltZSA9IGxhc3RNYXJrZXIuZ2V0RW5kKCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSBlbmRUaW1lIC0gc3RhcnRUaW1lO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLXdpZGdldCBpbnNldC1wYW5uZWxcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtaGVhZGVyLXRleHRcIj5cbiAgICAgICAgICAgIDxzcGFuIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29sbGFwc2VDbGlja30gY2xhc3NOYW1lPVwiY29sbGFwc2UtdG9nZ2xlXCI+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNvbGxhcHNlZCA/ICdcXHUyNWI2JyA6ICdcXHUyNWJjJ31cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm1hcmtlcnMubGVuZ3RofSBldmVudChzKSBvdmVyIHtNYXRoLmZsb29yKGR1cmF0aW9uKX1tc1xuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2F0ZXJmYWxsLWhlYWRlci1jb250cm9sc1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3YXRlcmZhbGwtZXhwb3J0LWJ1dHRvbiBidG4gYnRuLXNtXCJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVFeHBvcnRDbGlja30+RXhwb3J0PC9idXR0b24+XG4gICAgICAgICAgICA8T2N0aWNvbiBpY29uPVwic2VhcmNoXCIgLz5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1yYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj17MC4xfVxuICAgICAgICAgICAgICBtYXg9ezF9XG4gICAgICAgICAgICAgIHN0ZXA9ezAuMDF9XG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVpvb21GYWN0b3JDaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMuc3RhdGUuY29sbGFwc2VkID8gbnVsbCA6IDxXYXRlcmZhbGwgbWFya2Vycz17dGhpcy5wcm9wcy5tYXJrZXJzfSB6b29tRmFjdG9yPXt0aGlzLnN0YXRlLnpvb21GYWN0b3J9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVpvb21GYWN0b3JDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3pvb21GYWN0b3I6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpfSk7XG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZUNsaWNrKGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHMgPT4gKHtjb2xsYXBzZWQ6ICFzLmNvbGxhcHNlZH0pKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUV4cG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHRoaXMucHJvcHMubWFya2Vycy5tYXAobSA9PiBtLnNlcmlhbGl6ZSgpKSwgbnVsbCwgJyAgJyk7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoe3RleHQ6IGpzb259KTtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gYXdhaXQgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICAgIGRlZmF1bHRQYXRoOiAnZ2l0LXRpbWluZ3MuanNvbicsXG4gICAgfSk7XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBidWZmZXIuc2F2ZUFzKGZpbGVQYXRoKTtcbiAgfVxufVxuXG5cbmxldCBtYXJrZXJzID0gbnVsbDtcbmxldCBncm91cElkID0gMDtcbmNvbnN0IGdyb3VwcyA9IFtdO1xubGV0IGxhc3RNYXJrZXJUaW1lID0gbnVsbDtcbmxldCB1cGRhdGVUaW1lciA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdFRpbWluZ3NWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBzdGF0aWMgdXJpUGF0dGVybiA9ICdhdG9tLWdpdGh1YjovL2RlYnVnL3RpbWluZ3MnO1xuXG4gIHN0YXRpYyBidWlsZFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmlQYXR0ZXJuO1xuICB9XG5cbiAgc3RhdGljIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gIHN0YXRpYyBnZW5lcmF0ZU1hcmtlcihsYWJlbCkge1xuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIobGFiZWwsICgpID0+IHtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgfSk7XG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgaWYgKCFtYXJrZXJzIHx8IChsYXN0TWFya2VyVGltZSAmJiBNYXRoLmFicyhub3cgLSBsYXN0TWFya2VyVGltZSkgPj0gNTAwMCkpIHtcbiAgICAgIGdyb3VwSWQrKztcbiAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2Vyc30pO1xuICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPiAxMDApIHtcbiAgICAgICAgZ3JvdXBzLnBvcCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0TWFya2VyVGltZSA9IG5vdztcbiAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH1cblxuICBzdGF0aWMgcmVzdG9yZUdyb3VwKGdyb3VwKSB7XG4gICAgZ3JvdXBJZCsrO1xuICAgIGdyb3Vwcy51bnNoaWZ0KHtpZDogZ3JvdXBJZCwgbWFya2VyczogZ3JvdXB9KTtcbiAgICBHaXRUaW1pbmdzVmlldy5zY2hlZHVsZVVwZGF0ZSh0cnVlKTtcbiAgfVxuXG4gIHN0YXRpYyBzY2hlZHVsZVVwZGF0ZShpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIGlmICh1cGRhdGVUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHVwZGF0ZVRpbWVyKTtcbiAgICB9XG5cbiAgICB1cGRhdGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgR2l0VGltaW5nc1ZpZXcuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJyk7XG4gICAgfSwgaW1tZWRpYXRlID8gMCA6IDEwMDApO1xuICB9XG5cbiAgc3RhdGljIG9uRGlkVXBkYXRlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIEdpdFRpbWluZ3NWaWV3LmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvYmluZCh0aGlzLCAnaGFuZGxlSW1wb3J0Q2xpY2snKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgICAgR2l0VGltaW5nc1ZpZXcub25EaWRVcGRhdGUoKCkgPT4gdGhpcy5mb3JjZVVwZGF0ZSgpKSxcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0VGltaW5nc1ZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJpbXBvcnQtYnV0dG9uIGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0Q2xpY2t9PkltcG9ydDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2dyb3Vwcy5tYXAoKGdyb3VwLCBpZHgpID0+IChcbiAgICAgICAgICA8V2F0ZXJmYWxsV2lkZ2V0IGtleT17Z3JvdXAuaWR9IG1hcmtlcnM9e2dyb3VwLm1hcmtlcnN9IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZUltcG9ydENsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3Qge2ZpbGVQYXRoc30gPSBhd2FpdCBkaWFsb2cuc2hvd09wZW5EaWFsb2coe1xuICAgICAgcHJvcGVydGllczogWydvcGVuRmlsZSddLFxuICAgIH0pO1xuICAgIGlmICghZmlsZVBhdGhzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVQYXRoc1swXTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBmcy5yZWFkRmlsZShmaWxlbmFtZSwge2VuY29kaW5nOiAndXRmOCd9KTtcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICAgIGNvbnN0IHJlc3RvcmVkTWFya2VycyA9IGRhdGEubWFwKGl0ZW0gPT4gTWFya2VyLmRlc2VyaWFsaXplKGl0ZW0pKTtcbiAgICAgIEdpdFRpbWluZ3NWaWV3LnJlc3RvcmVHcm91cChyZXN0b3JlZE1hcmtlcnMpO1xuICAgIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ291bGQgbm90IGltcG9ydCB0aW1pbmdzIGZyb20gJHtmaWxlbmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2VyaWFsaXplcjogJ0dpdFRpbWluZ3NWaWV3JyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmJ1aWxkVVJJKCk7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdEh1YiBQYWNrYWdlIFRpbWluZ3MgVmlldyc7XG4gIH1cbn1cbiJdfQ==