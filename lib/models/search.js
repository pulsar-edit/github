"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullSearch = exports.default = void 0;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
  }

  // A null search has insufficient information to construct a canned query, so it should always return no results.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVUxMIiwiU3ltYm9sIiwiQ1JFQVRFX09OX0VNUFRZIiwiU2VhcmNoIiwiY29uc3RydWN0b3IiLCJuYW1lIiwicXVlcnkiLCJhdHRycyIsImdldE5hbWUiLCJjcmVhdGVRdWVyeSIsImlzTnVsbCIsInNob3dDcmVhdGVPbkVtcHR5IiwiZ2V0V2ViVVJMIiwicmVtb3RlIiwiaXNHaXRodWJSZXBvIiwiRXJyb3IiLCJnZXREb21haW4iLCJlbmNvZGVVUklDb21wb25lbnQiLCJpblJlbW90ZSIsImdldE93bmVyIiwiZ2V0UmVwbyIsInRyaW0iLCJudWxsU2VhcmNoIl0sInNvdXJjZXMiOlsic2VhcmNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE5VTEwgPSBTeW1ib2woJ251bGwnKTtcbmNvbnN0IENSRUFURV9PTl9FTVBUWSA9IFN5bWJvbCgnY3JlYXRlIG9uIGVtcHR5Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHF1ZXJ5LCBhdHRycyA9IHt9KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgdGhpcy5hdHRycyA9IGF0dHJzO1xuICB9XG5cbiAgZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgY3JlYXRlUXVlcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnk7XG4gIH1cblxuICAvLyBBIG51bGwgc2VhcmNoIGhhcyBpbnN1ZmZpY2llbnQgaW5mb3JtYXRpb24gdG8gY29uc3RydWN0IGEgY2FubmVkIHF1ZXJ5LCBzbyBpdCBzaG91bGQgYWx3YXlzIHJldHVybiBubyByZXN1bHRzLlxuICBpc051bGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cnNbTlVMTF0gfHwgZmFsc2U7XG4gIH1cblxuICBzaG93Q3JlYXRlT25FbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyc1tDUkVBVEVfT05fRU1QVFldIHx8IGZhbHNlO1xuICB9XG5cbiAgZ2V0V2ViVVJMKHJlbW90ZSkge1xuICAgIGlmICghcmVtb3RlLmlzR2l0aHViUmVwbygpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHQgdG8gZ2VuZXJhdGUgd2ViIFVSTCBmb3Igbm9uLUdpdEh1YiByZW1vdGUgJHtyZW1vdGUuZ2V0TmFtZSgpfWApO1xuICAgIH1cblxuICAgIHJldHVybiBgaHR0cHM6Ly8ke3JlbW90ZS5nZXREb21haW4oKX0vc2VhcmNoP3E9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVRdWVyeSgpKX1gO1xuICB9XG5cbiAgc3RhdGljIGluUmVtb3RlKHJlbW90ZSwgbmFtZSwgcXVlcnksIGF0dHJzID0ge30pIHtcbiAgICBpZiAoIXJlbW90ZS5pc0dpdGh1YlJlcG8oKSkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKG5hbWUsICcnLCB7Li4uYXR0cnMsIFtOVUxMXTogdHJ1ZX0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgdGhpcyhuYW1lLCBgcmVwbzoke3JlbW90ZS5nZXRPd25lcigpfS8ke3JlbW90ZS5nZXRSZXBvKCl9ICR7cXVlcnkudHJpbSgpfWAsIGF0dHJzKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbnVsbFNlYXJjaCA9IG5ldyBTZWFyY2goJycsICcnLCB7W05VTExdOiB0cnVlfSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsSUFBSSxHQUFHQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzNCLE1BQU1DLGVBQWUsR0FBR0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBRWxDLE1BQU1FLE1BQU0sQ0FBQztFQUMxQkMsV0FBVyxDQUFDQyxJQUFJLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ25DLElBQUksQ0FBQ0YsSUFBSSxHQUFHQSxJQUFJO0lBQ2hCLElBQUksQ0FBQ0MsS0FBSyxHQUFHQSxLQUFLO0lBQ2xCLElBQUksQ0FBQ0MsS0FBSyxHQUFHQSxLQUFLO0VBQ3BCO0VBRUFDLE9BQU8sR0FBRztJQUNSLE9BQU8sSUFBSSxDQUFDSCxJQUFJO0VBQ2xCO0VBRUFJLFdBQVcsR0FBRztJQUNaLE9BQU8sSUFBSSxDQUFDSCxLQUFLO0VBQ25COztFQUVBO0VBQ0FJLE1BQU0sR0FBRztJQUNQLE9BQU8sSUFBSSxDQUFDSCxLQUFLLENBQUNQLElBQUksQ0FBQyxJQUFJLEtBQUs7RUFDbEM7RUFFQVcsaUJBQWlCLEdBQUc7SUFDbEIsT0FBTyxJQUFJLENBQUNKLEtBQUssQ0FBQ0wsZUFBZSxDQUFDLElBQUksS0FBSztFQUM3QztFQUVBVSxTQUFTLENBQUNDLE1BQU0sRUFBRTtJQUNoQixJQUFJLENBQUNBLE1BQU0sQ0FBQ0MsWUFBWSxFQUFFLEVBQUU7TUFDMUIsTUFBTSxJQUFJQyxLQUFLLENBQUUscURBQW9ERixNQUFNLENBQUNMLE9BQU8sRUFBRyxFQUFDLENBQUM7SUFDMUY7SUFFQSxPQUFRLFdBQVVLLE1BQU0sQ0FBQ0csU0FBUyxFQUFHLGFBQVlDLGtCQUFrQixDQUFDLElBQUksQ0FBQ1IsV0FBVyxFQUFFLENBQUUsRUFBQztFQUMzRjtFQUVBLE9BQU9TLFFBQVEsQ0FBQ0wsTUFBTSxFQUFFUixJQUFJLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQy9DLElBQUksQ0FBQ00sTUFBTSxDQUFDQyxZQUFZLEVBQUUsRUFBRTtNQUMxQixPQUFPLElBQUksSUFBSSxDQUFDVCxJQUFJLEVBQUUsRUFBRSxvQkFBTUUsS0FBSztRQUFFLENBQUNQLElBQUksR0FBRztNQUFJLEdBQUU7SUFDckQ7SUFFQSxPQUFPLElBQUksSUFBSSxDQUFDSyxJQUFJLEVBQUcsUUFBT1EsTUFBTSxDQUFDTSxRQUFRLEVBQUcsSUFBR04sTUFBTSxDQUFDTyxPQUFPLEVBQUcsSUFBR2QsS0FBSyxDQUFDZSxJQUFJLEVBQUcsRUFBQyxFQUFFZCxLQUFLLENBQUM7RUFDL0Y7QUFDRjtBQUFDO0FBRU0sTUFBTWUsVUFBVSxHQUFHLElBQUluQixNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtFQUFDLENBQUNILElBQUksR0FBRztBQUFJLENBQUMsQ0FBQztBQUFDIn0=