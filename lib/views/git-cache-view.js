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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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