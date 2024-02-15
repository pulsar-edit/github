"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullSearch = exports.default = void 0;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVUxMIiwiU3ltYm9sIiwiQ1JFQVRFX09OX0VNUFRZIiwiU2VhcmNoIiwiY29uc3RydWN0b3IiLCJuYW1lIiwicXVlcnkiLCJhdHRycyIsImdldE5hbWUiLCJjcmVhdGVRdWVyeSIsImlzTnVsbCIsInNob3dDcmVhdGVPbkVtcHR5IiwiZ2V0V2ViVVJMIiwicmVtb3RlIiwiaXNHaXRodWJSZXBvIiwiRXJyb3IiLCJnZXREb21haW4iLCJlbmNvZGVVUklDb21wb25lbnQiLCJpblJlbW90ZSIsIl9vYmplY3RTcHJlYWQiLCJnZXRPd25lciIsImdldFJlcG8iLCJ0cmltIiwiZXhwb3J0cyIsImRlZmF1bHQiLCJudWxsU2VhcmNoIl0sInNvdXJjZXMiOlsic2VhcmNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE5VTEwgPSBTeW1ib2woJ251bGwnKTtcbmNvbnN0IENSRUFURV9PTl9FTVBUWSA9IFN5bWJvbCgnY3JlYXRlIG9uIGVtcHR5Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHF1ZXJ5LCBhdHRycyA9IHt9KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgdGhpcy5hdHRycyA9IGF0dHJzO1xuICB9XG5cbiAgZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgY3JlYXRlUXVlcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnk7XG4gIH1cblxuICAvLyBBIG51bGwgc2VhcmNoIGhhcyBpbnN1ZmZpY2llbnQgaW5mb3JtYXRpb24gdG8gY29uc3RydWN0IGEgY2FubmVkIHF1ZXJ5LCBzbyBpdCBzaG91bGQgYWx3YXlzIHJldHVybiBubyByZXN1bHRzLlxuICBpc051bGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cnNbTlVMTF0gfHwgZmFsc2U7XG4gIH1cblxuICBzaG93Q3JlYXRlT25FbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyc1tDUkVBVEVfT05fRU1QVFldIHx8IGZhbHNlO1xuICB9XG5cbiAgZ2V0V2ViVVJMKHJlbW90ZSkge1xuICAgIGlmICghcmVtb3RlLmlzR2l0aHViUmVwbygpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHQgdG8gZ2VuZXJhdGUgd2ViIFVSTCBmb3Igbm9uLUdpdEh1YiByZW1vdGUgJHtyZW1vdGUuZ2V0TmFtZSgpfWApO1xuICAgIH1cblxuICAgIHJldHVybiBgaHR0cHM6Ly8ke3JlbW90ZS5nZXREb21haW4oKX0vc2VhcmNoP3E9JHtlbmNvZGVVUklDb21wb25lbnQodGhpcy5jcmVhdGVRdWVyeSgpKX1gO1xuICB9XG5cbiAgc3RhdGljIGluUmVtb3RlKHJlbW90ZSwgbmFtZSwgcXVlcnksIGF0dHJzID0ge30pIHtcbiAgICBpZiAoIXJlbW90ZS5pc0dpdGh1YlJlcG8oKSkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKG5hbWUsICcnLCB7Li4uYXR0cnMsIFtOVUxMXTogdHJ1ZX0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgdGhpcyhuYW1lLCBgcmVwbzoke3JlbW90ZS5nZXRPd25lcigpfS8ke3JlbW90ZS5nZXRSZXBvKCl9ICR7cXVlcnkudHJpbSgpfWAsIGF0dHJzKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbnVsbFNlYXJjaCA9IG5ldyBTZWFyY2goJycsICcnLCB7W05VTExdOiB0cnVlfSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsSUFBSSxHQUFHQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzNCLE1BQU1DLGVBQWUsR0FBR0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBRWxDLE1BQU1FLE1BQU0sQ0FBQztFQUMxQkMsV0FBV0EsQ0FBQ0MsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtJQUNuQyxJQUFJLENBQUNGLElBQUksR0FBR0EsSUFBSTtJQUNoQixJQUFJLENBQUNDLEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNDLEtBQUssR0FBR0EsS0FBSztFQUNwQjtFQUVBQyxPQUFPQSxDQUFBLEVBQUc7SUFDUixPQUFPLElBQUksQ0FBQ0gsSUFBSTtFQUNsQjtFQUVBSSxXQUFXQSxDQUFBLEVBQUc7SUFDWixPQUFPLElBQUksQ0FBQ0gsS0FBSztFQUNuQjs7RUFFQTtFQUNBSSxNQUFNQSxDQUFBLEVBQUc7SUFDUCxPQUFPLElBQUksQ0FBQ0gsS0FBSyxDQUFDUCxJQUFJLENBQUMsSUFBSSxLQUFLO0VBQ2xDO0VBRUFXLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLE9BQU8sSUFBSSxDQUFDSixLQUFLLENBQUNMLGVBQWUsQ0FBQyxJQUFJLEtBQUs7RUFDN0M7RUFFQVUsU0FBU0EsQ0FBQ0MsTUFBTSxFQUFFO0lBQ2hCLElBQUksQ0FBQ0EsTUFBTSxDQUFDQyxZQUFZLENBQUMsQ0FBQyxFQUFFO01BQzFCLE1BQU0sSUFBSUMsS0FBSyxDQUFFLHFEQUFvREYsTUFBTSxDQUFDTCxPQUFPLENBQUMsQ0FBRSxFQUFDLENBQUM7SUFDMUY7SUFFQSxPQUFRLFdBQVVLLE1BQU0sQ0FBQ0csU0FBUyxDQUFDLENBQUUsYUFBWUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDUixXQUFXLENBQUMsQ0FBQyxDQUFFLEVBQUM7RUFDM0Y7RUFFQSxPQUFPUyxRQUFRQSxDQUFDTCxNQUFNLEVBQUVSLElBQUksRUFBRUMsS0FBSyxFQUFFQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDL0MsSUFBSSxDQUFDTSxNQUFNLENBQUNDLFlBQVksQ0FBQyxDQUFDLEVBQUU7TUFDMUIsT0FBTyxJQUFJLElBQUksQ0FBQ1QsSUFBSSxFQUFFLEVBQUUsRUFBQWMsYUFBQSxLQUFNWixLQUFLO1FBQUUsQ0FBQ1AsSUFBSSxHQUFHO01BQUksRUFBQyxDQUFDO0lBQ3JEO0lBRUEsT0FBTyxJQUFJLElBQUksQ0FBQ0ssSUFBSSxFQUFHLFFBQU9RLE1BQU0sQ0FBQ08sUUFBUSxDQUFDLENBQUUsSUFBR1AsTUFBTSxDQUFDUSxPQUFPLENBQUMsQ0FBRSxJQUFHZixLQUFLLENBQUNnQixJQUFJLENBQUMsQ0FBRSxFQUFDLEVBQUVmLEtBQUssQ0FBQztFQUMvRjtBQUNGO0FBQUNnQixPQUFBLENBQUFDLE9BQUEsR0FBQXJCLE1BQUE7QUFFTSxNQUFNc0IsVUFBVSxHQUFHLElBQUl0QixNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtFQUFDLENBQUNILElBQUksR0FBRztBQUFJLENBQUMsQ0FBQztBQUFDdUIsT0FBQSxDQUFBRSxVQUFBLEdBQUFBLFVBQUEifQ==