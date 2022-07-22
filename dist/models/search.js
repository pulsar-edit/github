"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullSearch = exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NULL = Symbol('null');
const CREATE_ON_EMPTY = Symbol('create on empty');

class Search {
  constructor(name, query, attrs = {}) {
    this.name = name;
    this.query = query;
    this.attrs = attrs;
  }

  getName() {
    return this.name;
  }

  createQuery() {
    return this.query;
  } // A null search has insufficient information to construct a canned query, so it should always return no results.


  isNull() {
    return this.attrs[NULL] || false;
  }

  showCreateOnEmpty() {
    return this.attrs[CREATE_ON_EMPTY] || false;
  }

  getWebURL(remote) {
    if (!remote.isGithubRepo()) {
      throw new Error(`Attempt to generate web URL for non-GitHub remote ${remote.getName()}`);
    }

    return `https://${remote.getDomain()}/search?q=${encodeURIComponent(this.createQuery())}`;
  }

  static inRemote(remote, name, query, attrs = {}) {
    if (!remote.isGithubRepo()) {
      return new this(name, '', _objectSpread({}, attrs, {
        [NULL]: true
      }));
    }

    return new this(name, `repo:${remote.getOwner()}/${remote.getRepo()} ${query.trim()}`, attrs);
  }

}

exports.default = Search;
const nullSearch = new Search('', '', {
  [NULL]: true
});
exports.nullSearch = nullSearch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvc2VhcmNoLmpzIl0sIm5hbWVzIjpbIk5VTEwiLCJTeW1ib2wiLCJDUkVBVEVfT05fRU1QVFkiLCJTZWFyY2giLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJxdWVyeSIsImF0dHJzIiwiZ2V0TmFtZSIsImNyZWF0ZVF1ZXJ5IiwiaXNOdWxsIiwic2hvd0NyZWF0ZU9uRW1wdHkiLCJnZXRXZWJVUkwiLCJyZW1vdGUiLCJpc0dpdGh1YlJlcG8iLCJFcnJvciIsImdldERvbWFpbiIsImVuY29kZVVSSUNvbXBvbmVudCIsImluUmVtb3RlIiwiZ2V0T3duZXIiLCJnZXRSZXBvIiwidHJpbSIsIm51bGxTZWFyY2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNQSxJQUFJLEdBQUdDLE1BQU0sQ0FBQyxNQUFELENBQW5CO0FBQ0EsTUFBTUMsZUFBZSxHQUFHRCxNQUFNLENBQUMsaUJBQUQsQ0FBOUI7O0FBRWUsTUFBTUUsTUFBTixDQUFhO0FBQzFCQyxFQUFBQSxXQUFXLENBQUNDLElBQUQsRUFBT0MsS0FBUCxFQUFjQyxLQUFLLEdBQUcsRUFBdEIsRUFBMEI7QUFDbkMsU0FBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7O0FBRURDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sS0FBS0gsSUFBWjtBQUNEOztBQUVESSxFQUFBQSxXQUFXLEdBQUc7QUFDWixXQUFPLEtBQUtILEtBQVo7QUFDRCxHQWJ5QixDQWUxQjs7O0FBQ0FJLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQU8sS0FBS0gsS0FBTCxDQUFXUCxJQUFYLEtBQW9CLEtBQTNCO0FBQ0Q7O0FBRURXLEVBQUFBLGlCQUFpQixHQUFHO0FBQ2xCLFdBQU8sS0FBS0osS0FBTCxDQUFXTCxlQUFYLEtBQStCLEtBQXRDO0FBQ0Q7O0FBRURVLEVBQUFBLFNBQVMsQ0FBQ0MsTUFBRCxFQUFTO0FBQ2hCLFFBQUksQ0FBQ0EsTUFBTSxDQUFDQyxZQUFQLEVBQUwsRUFBNEI7QUFDMUIsWUFBTSxJQUFJQyxLQUFKLENBQVcscURBQW9ERixNQUFNLENBQUNMLE9BQVAsRUFBaUIsRUFBaEYsQ0FBTjtBQUNEOztBQUVELFdBQVEsV0FBVUssTUFBTSxDQUFDRyxTQUFQLEVBQW1CLGFBQVlDLGtCQUFrQixDQUFDLEtBQUtSLFdBQUwsRUFBRCxDQUFxQixFQUF4RjtBQUNEOztBQUVjLFNBQVJTLFFBQVEsQ0FBQ0wsTUFBRCxFQUFTUixJQUFULEVBQWVDLEtBQWYsRUFBc0JDLEtBQUssR0FBRyxFQUE5QixFQUFrQztBQUMvQyxRQUFJLENBQUNNLE1BQU0sQ0FBQ0MsWUFBUCxFQUFMLEVBQTRCO0FBQzFCLGFBQU8sSUFBSSxJQUFKLENBQVNULElBQVQsRUFBZSxFQUFmLG9CQUF1QkUsS0FBdkI7QUFBOEIsU0FBQ1AsSUFBRCxHQUFRO0FBQXRDLFNBQVA7QUFDRDs7QUFFRCxXQUFPLElBQUksSUFBSixDQUFTSyxJQUFULEVBQWdCLFFBQU9RLE1BQU0sQ0FBQ00sUUFBUCxFQUFrQixJQUFHTixNQUFNLENBQUNPLE9BQVAsRUFBaUIsSUFBR2QsS0FBSyxDQUFDZSxJQUFOLEVBQWEsRUFBN0UsRUFBZ0ZkLEtBQWhGLENBQVA7QUFDRDs7QUF0Q3lCOzs7QUF5Q3JCLE1BQU1lLFVBQVUsR0FBRyxJQUFJbkIsTUFBSixDQUFXLEVBQVgsRUFBZSxFQUFmLEVBQW1CO0FBQUMsR0FBQ0gsSUFBRCxHQUFRO0FBQVQsQ0FBbkIsQ0FBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBOVUxMID0gU3ltYm9sKCdudWxsJyk7XG5jb25zdCBDUkVBVEVfT05fRU1QVFkgPSBTeW1ib2woJ2NyZWF0ZSBvbiBlbXB0eScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWFyY2gge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBxdWVyeSwgYXR0cnMgPSB7fSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuICAgIHRoaXMuYXR0cnMgPSBhdHRycztcbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGNyZWF0ZVF1ZXJ5KCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5O1xuICB9XG5cbiAgLy8gQSBudWxsIHNlYXJjaCBoYXMgaW5zdWZmaWNpZW50IGluZm9ybWF0aW9uIHRvIGNvbnN0cnVjdCBhIGNhbm5lZCBxdWVyeSwgc28gaXQgc2hvdWxkIGFsd2F5cyByZXR1cm4gbm8gcmVzdWx0cy5cbiAgaXNOdWxsKCkge1xuICAgIHJldHVybiB0aGlzLmF0dHJzW05VTExdIHx8IGZhbHNlO1xuICB9XG5cbiAgc2hvd0NyZWF0ZU9uRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cnNbQ1JFQVRFX09OX0VNUFRZXSB8fCBmYWxzZTtcbiAgfVxuXG4gIGdldFdlYlVSTChyZW1vdGUpIHtcbiAgICBpZiAoIXJlbW90ZS5pc0dpdGh1YlJlcG8oKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRlbXB0IHRvIGdlbmVyYXRlIHdlYiBVUkwgZm9yIG5vbi1HaXRIdWIgcmVtb3RlICR7cmVtb3RlLmdldE5hbWUoKX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYGh0dHBzOi8vJHtyZW1vdGUuZ2V0RG9tYWluKCl9L3NlYXJjaD9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY3JlYXRlUXVlcnkoKSl9YDtcbiAgfVxuXG4gIHN0YXRpYyBpblJlbW90ZShyZW1vdGUsIG5hbWUsIHF1ZXJ5LCBhdHRycyA9IHt9KSB7XG4gICAgaWYgKCFyZW1vdGUuaXNHaXRodWJSZXBvKCkpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcyhuYW1lLCAnJywgey4uLmF0dHJzLCBbTlVMTF06IHRydWV9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IHRoaXMobmFtZSwgYHJlcG86JHtyZW1vdGUuZ2V0T3duZXIoKX0vJHtyZW1vdGUuZ2V0UmVwbygpfSAke3F1ZXJ5LnRyaW0oKX1gLCBhdHRycyk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG51bGxTZWFyY2ggPSBuZXcgU2VhcmNoKCcnLCAnJywge1tOVUxMXTogdHJ1ZX0pO1xuIl19