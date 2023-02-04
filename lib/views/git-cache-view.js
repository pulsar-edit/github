"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _util = require("util");
var _observeModel = _interopRequireDefault(require("./observe-model"));
var _helpers = require("../helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const sortOrders = {
  'by key': (a, b) => a.key.localeCompare(b.key),
  'oldest first': (a, b) => b.age - a.age,
  'newest first': (a, b) => a.age - b.age,
  'most hits': (a, b) => b.hits - a.hits,
  'fewest hits': (a, b) => a.hits - b.hits
};
class GitCacheView extends _react.default.Component {
  static buildURI() {
    return this.uriPattern;
  }
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'fetchRepositoryData', 'fetchCacheData', 'renderCache', 'didSelectItem', 'clearCache');
    this.state = {
      order: 'by key'
    };
  }
  getURI() {
    return 'atom-github://debug/cache';
  }
  getTitle() {
    return 'GitHub Package Cache View';
  }
  serialize() {
    return null;
  }
  fetchRepositoryData(repository) {
    return repository.getCache();
  }
  fetchCacheData(cache) {
    const cached = {};
    const promises = [];
    const now = performance.now();
    for (const [key, value] of cache) {
      cached[key] = {
        hits: value.hits,
        age: now - value.createdAt
      };
      promises.push(value.promise.then(payload => (0, _util.inspect)(payload, {
        depth: 3,
        breakLength: 30
      }), err => `${err.message}\n${err.stack}`).then(resolved => {
        cached[key].value = resolved;
      }));
    }
    return Promise.all(promises).then(() => cached);
  }
  render() {
    return _react.default.createElement(_observeModel.default, {
      model: this.props.repository,
      fetchData: this.fetchRepositoryData
    }, cache => _react.default.createElement(_observeModel.default, {
      model: cache,
      fetchData: this.fetchCacheData
    }, this.renderCache));
  }
  renderCache(contents) {
    const rows = Object.keys(contents || {}).map(key => {
      return {
        key,
        age: contents[key].age,
        hits: contents[key].hits,
        content: contents[key].value
      };
    });
    rows.sort(sortOrders[this.state.order]);
    const orders = Object.keys(sortOrders);
    return _react.default.createElement("div", {
      className: "github-CacheView"
    }, _react.default.createElement("header", null, _react.default.createElement("h1", null, "Cache contents"), _react.default.createElement("p", null, _react.default.createElement("span", {
      className: "badge"
    }, rows.length), " cached items")), _react.default.createElement("main", null, _react.default.createElement("p", {
      className: "github-CacheView-Controls"
    }, _react.default.createElement("span", {
      className: "github-CacheView-Order"
    }, "order", _react.default.createElement("select", {
      className: "input-select",
      onChange: this.didSelectItem,
      value: this.state.order
    }, orders.map(order => {
      return _react.default.createElement("option", {
        key: order,
        value: order
      }, order);
    }))), _react.default.createElement("span", {
      className: "github-CacheView-Clear"
    }, _react.default.createElement("button", {
      className: "btn icon icon-trashcan",
      onClick: this.clearCache
    }, "Clear"))), _react.default.createElement("table", null, _react.default.createElement("thead", null, _react.default.createElement("tr", null, _react.default.createElement("td", {
      className: "github-CacheView-Key"
    }, "key"), _react.default.createElement("td", {
      className: "github-CacheView-Age"
    }, "age"), _react.default.createElement("td", {
      className: "github-CacheView-Hits"
    }, "hits"), _react.default.createElement("td", {
      className: "github-CacheView-Content"
    }, "content"))), _react.default.createElement("tbody", null, rows.map(row => _react.default.createElement("tr", {
      key: row.key,
      className: "github-CacheView-Row"
    }, _react.default.createElement("td", {
      className: "github-CacheView-Key"
    }, _react.default.createElement("button", {
      className: "btn",
      onClick: () => this.didClickKey(row.key)
    }, row.key)), _react.default.createElement("td", {
      className: "github-CacheView-Age"
    }, this.formatAge(row.age)), _react.default.createElement("td", {
      className: "github-CacheView-Hits"
    }, row.hits), _react.default.createElement("td", {
      className: "github-CacheView-Content"
    }, _react.default.createElement("code", null, row.content))))))));
  }
  formatAge(ageMs) {
    let remaining = ageMs;
    const parts = [];
    if (remaining > 3600000) {
      const hours = Math.floor(remaining / 3600000);
      parts.push(`${hours}h`);
      remaining -= 3600000 * hours;
    }
    if (remaining > 60000) {
      const minutes = Math.floor(remaining / 60000);
      parts.push(`${minutes}m`);
      remaining -= 60000 * minutes;
    }
    if (remaining > 1000) {
      const seconds = Math.floor(remaining / 1000);
      parts.push(`${seconds}s`);
      remaining -= 1000 * seconds;
    }
    parts.push(`${Math.floor(remaining)}ms`);
    return parts.slice(parts.length - 2).join(' ');
  }
  didSelectItem(event) {
    this.setState({
      order: event.target.value
    });
  }
  didClickKey(key) {
    const cache = this.props.repository.getCache();
    if (!cache) {
      return;
    }
    cache.removePrimary(key);
  }
  clearCache() {
    const cache = this.props.repository.getCache();
    if (!cache) {
      return;
    }
    cache.clear();
  }
}
exports.default = GitCacheView;
_defineProperty(GitCacheView, "uriPattern", 'atom-github://debug/cache');
_defineProperty(GitCacheView, "propTypes", {
  repository: _propTypes.default.object.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzb3J0T3JkZXJzIiwiYSIsImIiLCJrZXkiLCJsb2NhbGVDb21wYXJlIiwiYWdlIiwiaGl0cyIsIkdpdENhY2hlVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiYnVpbGRVUkkiLCJ1cmlQYXR0ZXJuIiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImNvbnRleHQiLCJhdXRvYmluZCIsInN0YXRlIiwib3JkZXIiLCJnZXRVUkkiLCJnZXRUaXRsZSIsInNlcmlhbGl6ZSIsImZldGNoUmVwb3NpdG9yeURhdGEiLCJyZXBvc2l0b3J5IiwiZ2V0Q2FjaGUiLCJmZXRjaENhY2hlRGF0YSIsImNhY2hlIiwiY2FjaGVkIiwicHJvbWlzZXMiLCJub3ciLCJwZXJmb3JtYW5jZSIsInZhbHVlIiwiY3JlYXRlZEF0IiwicHVzaCIsInByb21pc2UiLCJ0aGVuIiwicGF5bG9hZCIsImluc3BlY3QiLCJkZXB0aCIsImJyZWFrTGVuZ3RoIiwiZXJyIiwibWVzc2FnZSIsInN0YWNrIiwicmVzb2x2ZWQiLCJQcm9taXNlIiwiYWxsIiwicmVuZGVyIiwicmVuZGVyQ2FjaGUiLCJjb250ZW50cyIsInJvd3MiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiY29udGVudCIsInNvcnQiLCJvcmRlcnMiLCJsZW5ndGgiLCJkaWRTZWxlY3RJdGVtIiwiY2xlYXJDYWNoZSIsInJvdyIsImRpZENsaWNrS2V5IiwiZm9ybWF0QWdlIiwiYWdlTXMiLCJyZW1haW5pbmciLCJwYXJ0cyIsImhvdXJzIiwiTWF0aCIsImZsb29yIiwibWludXRlcyIsInNlY29uZHMiLCJzbGljZSIsImpvaW4iLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwicmVtb3ZlUHJpbWFyeSIsImNsZWFyIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImdpdC1jYWNoZS12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtpbnNwZWN0fSBmcm9tICd1dGlsJztcblxuaW1wb3J0IE9ic2VydmVNb2RlbCBmcm9tICcuL29ic2VydmUtbW9kZWwnO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmNvbnN0IHNvcnRPcmRlcnMgPSB7XG4gICdieSBrZXknOiAoYSwgYikgPT4gYS5rZXkubG9jYWxlQ29tcGFyZShiLmtleSksXG4gICdvbGRlc3QgZmlyc3QnOiAoYSwgYikgPT4gYi5hZ2UgLSBhLmFnZSxcbiAgJ25ld2VzdCBmaXJzdCc6IChhLCBiKSA9PiBhLmFnZSAtIGIuYWdlLFxuICAnbW9zdCBoaXRzJzogKGEsIGIpID0+IGIuaGl0cyAtIGEuaGl0cyxcbiAgJ2Zld2VzdCBoaXRzJzogKGEsIGIpID0+IGEuaGl0cyAtIGIuaGl0cyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdENhY2hlVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyB1cmlQYXR0ZXJuID0gJ2F0b20tZ2l0aHViOi8vZGVidWcvY2FjaGUnXG5cbiAgc3RhdGljIGJ1aWxkVVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaVBhdHRlcm47XG4gIH1cblxuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdmZXRjaFJlcG9zaXRvcnlEYXRhJywgJ2ZldGNoQ2FjaGVEYXRhJywgJ3JlbmRlckNhY2hlJywgJ2RpZFNlbGVjdEl0ZW0nLCAnY2xlYXJDYWNoZScpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG9yZGVyOiAnYnkga2V5JyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiAnYXRvbS1naXRodWI6Ly9kZWJ1Zy9jYWNoZSc7XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0dpdEh1YiBQYWNrYWdlIENhY2hlIFZpZXcnO1xuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZmV0Y2hSZXBvc2l0b3J5RGF0YShyZXBvc2l0b3J5KSB7XG4gICAgcmV0dXJuIHJlcG9zaXRvcnkuZ2V0Q2FjaGUoKTtcbiAgfVxuXG4gIGZldGNoQ2FjaGVEYXRhKGNhY2hlKSB7XG4gICAgY29uc3QgY2FjaGVkID0ge307XG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcbiAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcblxuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGNhY2hlKSB7XG4gICAgICBjYWNoZWRba2V5XSA9IHtcbiAgICAgICAgaGl0czogdmFsdWUuaGl0cyxcbiAgICAgICAgYWdlOiBub3cgLSB2YWx1ZS5jcmVhdGVkQXQsXG4gICAgICB9O1xuXG4gICAgICBwcm9taXNlcy5wdXNoKFxuICAgICAgICB2YWx1ZS5wcm9taXNlXG4gICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICBwYXlsb2FkID0+IGluc3BlY3QocGF5bG9hZCwge2RlcHRoOiAzLCBicmVha0xlbmd0aDogMzB9KSxcbiAgICAgICAgICAgIGVyciA9PiBgJHtlcnIubWVzc2FnZX1cXG4ke2Vyci5zdGFja31gLFxuICAgICAgICAgIClcbiAgICAgICAgICAudGhlbihyZXNvbHZlZCA9PiB7IGNhY2hlZFtrZXldLnZhbHVlID0gcmVzb2x2ZWQ7IH0pLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4gY2FjaGVkKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17dGhpcy5wcm9wcy5yZXBvc2l0b3J5fSBmZXRjaERhdGE9e3RoaXMuZmV0Y2hSZXBvc2l0b3J5RGF0YX0+XG4gICAgICAgIHtjYWNoZSA9PiAoXG4gICAgICAgICAgPE9ic2VydmVNb2RlbCBtb2RlbD17Y2FjaGV9IGZldGNoRGF0YT17dGhpcy5mZXRjaENhY2hlRGF0YX0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDYWNoZX1cbiAgICAgICAgICA8L09ic2VydmVNb2RlbD5cbiAgICAgICAgKX1cbiAgICAgIDwvT2JzZXJ2ZU1vZGVsPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDYWNoZShjb250ZW50cykge1xuICAgIGNvbnN0IHJvd3MgPSBPYmplY3Qua2V5cyhjb250ZW50cyB8fCB7fSkubWFwKGtleSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXksXG4gICAgICAgIGFnZTogY29udGVudHNba2V5XS5hZ2UsXG4gICAgICAgIGhpdHM6IGNvbnRlbnRzW2tleV0uaGl0cyxcbiAgICAgICAgY29udGVudDogY29udGVudHNba2V5XS52YWx1ZSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByb3dzLnNvcnQoc29ydE9yZGVyc1t0aGlzLnN0YXRlLm9yZGVyXSk7XG5cbiAgICBjb25zdCBvcmRlcnMgPSBPYmplY3Qua2V5cyhzb3J0T3JkZXJzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1DYWNoZVZpZXdcIj5cbiAgICAgICAgPGhlYWRlcj5cbiAgICAgICAgICA8aDE+Q2FjaGUgY29udGVudHM8L2gxPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmFkZ2VcIj57cm93cy5sZW5ndGh9PC9zcGFuPiBjYWNoZWQgaXRlbXNcbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvaGVhZGVyPlxuICAgICAgICA8bWFpbj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUNvbnRyb2xzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LU9yZGVyXCI+XG4gICAgICAgICAgICAgIG9yZGVyXG4gICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dC1zZWxlY3RcIlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmRpZFNlbGVjdEl0ZW19XG4gICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUub3JkZXJ9PlxuICAgICAgICAgICAgICAgIHtvcmRlcnMubWFwKG9yZGVyID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiA8b3B0aW9uIGtleT17b3JkZXJ9IHZhbHVlPXtvcmRlcn0+e29yZGVyfTwvb3B0aW9uPjtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUNsZWFyXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGljb24gaWNvbi10cmFzaGNhblwiIG9uQ2xpY2s9e3RoaXMuY2xlYXJDYWNoZX0+XG4gICAgICAgICAgICAgICAgQ2xlYXJcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDx0YWJsZT5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUtleVwiPmtleTwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImdpdGh1Yi1DYWNoZVZpZXctQWdlXCI+YWdlPC90ZD5cbiAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiZ2l0aHViLUNhY2hlVmlldy1IaXRzXCI+aGl0czwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cImdpdGh1Yi1DYWNoZVZpZXctQ29udGVudFwiPmNvbnRlbnQ8L3RkPlxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAge3Jvd3MubWFwKHJvdyA9PiAoXG4gICAgICAgICAgICAgICAgPHRyIGtleT17cm93LmtleX0gY2xhc3NOYW1lPVwiZ2l0aHViLUNhY2hlVmlldy1Sb3dcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUtleVwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuZGlkQ2xpY2tLZXkocm93LmtleSl9PlxuICAgICAgICAgICAgICAgICAgICAgIHtyb3cua2V5fVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwiZ2l0aHViLUNhY2hlVmlldy1BZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuZm9ybWF0QWdlKHJvdy5hZ2UpfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUhpdHNcIj5cbiAgICAgICAgICAgICAgICAgICAge3Jvdy5oaXRzfVxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJnaXRodWItQ2FjaGVWaWV3LUNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGNvZGU+e3Jvdy5jb250ZW50fTwvY29kZT5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmb3JtYXRBZ2UoYWdlTXMpIHtcbiAgICBsZXQgcmVtYWluaW5nID0gYWdlTXM7XG4gICAgY29uc3QgcGFydHMgPSBbXTtcblxuICAgIGlmIChyZW1haW5pbmcgPiAzNjAwMDAwKSB7XG4gICAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IocmVtYWluaW5nIC8gMzYwMDAwMCk7XG4gICAgICBwYXJ0cy5wdXNoKGAke2hvdXJzfWhgKTtcbiAgICAgIHJlbWFpbmluZyAtPSAoMzYwMDAwMCAqIGhvdXJzKTtcbiAgICB9XG5cbiAgICBpZiAocmVtYWluaW5nID4gNjAwMDApIHtcbiAgICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHJlbWFpbmluZyAvIDYwMDAwKTtcbiAgICAgIHBhcnRzLnB1c2goYCR7bWludXRlc31tYCk7XG4gICAgICByZW1haW5pbmcgLT0gKDYwMDAwICogbWludXRlcyk7XG4gICAgfVxuXG4gICAgaWYgKHJlbWFpbmluZyA+IDEwMDApIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLmZsb29yKHJlbWFpbmluZyAvIDEwMDApO1xuICAgICAgcGFydHMucHVzaChgJHtzZWNvbmRzfXNgKTtcbiAgICAgIHJlbWFpbmluZyAtPSAoMTAwMCAqIHNlY29uZHMpO1xuICAgIH1cblxuICAgIHBhcnRzLnB1c2goYCR7TWF0aC5mbG9vcihyZW1haW5pbmcpfW1zYCk7XG5cbiAgICByZXR1cm4gcGFydHMuc2xpY2UocGFydHMubGVuZ3RoIC0gMikuam9pbignICcpO1xuICB9XG5cbiAgZGlkU2VsZWN0SXRlbShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29yZGVyOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgfVxuXG4gIGRpZENsaWNrS2V5KGtleSkge1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5wcm9wcy5yZXBvc2l0b3J5LmdldENhY2hlKCk7XG4gICAgaWYgKCFjYWNoZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhY2hlLnJlbW92ZVByaW1hcnkoa2V5KTtcbiAgfVxuXG4gIGNsZWFyQ2FjaGUoKSB7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLnByb3BzLnJlcG9zaXRvcnkuZ2V0Q2FjaGUoKTtcbiAgICBpZiAoIWNhY2hlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FjaGUuY2xlYXIoKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQW9DO0FBQUE7QUFBQTtBQUFBO0FBRXBDLE1BQU1BLFVBQVUsR0FBRztFQUNqQixRQUFRLEVBQUUsQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLEtBQUtELENBQUMsQ0FBQ0UsR0FBRyxDQUFDQyxhQUFhLENBQUNGLENBQUMsQ0FBQ0MsR0FBRyxDQUFDO0VBQzlDLGNBQWMsRUFBRSxDQUFDRixDQUFDLEVBQUVDLENBQUMsS0FBS0EsQ0FBQyxDQUFDRyxHQUFHLEdBQUdKLENBQUMsQ0FBQ0ksR0FBRztFQUN2QyxjQUFjLEVBQUUsQ0FBQ0osQ0FBQyxFQUFFQyxDQUFDLEtBQUtELENBQUMsQ0FBQ0ksR0FBRyxHQUFHSCxDQUFDLENBQUNHLEdBQUc7RUFDdkMsV0FBVyxFQUFFLENBQUNKLENBQUMsRUFBRUMsQ0FBQyxLQUFLQSxDQUFDLENBQUNJLElBQUksR0FBR0wsQ0FBQyxDQUFDSyxJQUFJO0VBQ3RDLGFBQWEsRUFBRSxDQUFDTCxDQUFDLEVBQUVDLENBQUMsS0FBS0QsQ0FBQyxDQUFDSyxJQUFJLEdBQUdKLENBQUMsQ0FBQ0k7QUFDdEMsQ0FBQztBQUVjLE1BQU1DLFlBQVksU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFHeEQsT0FBT0MsUUFBUSxHQUFHO0lBQ2hCLE9BQU8sSUFBSSxDQUFDQyxVQUFVO0VBQ3hCO0VBTUFDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFQyxPQUFPLEVB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