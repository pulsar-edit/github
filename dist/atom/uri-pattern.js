"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonURIMatch = exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Match and capture parts of a URI, like a specialized dialect of regular expression. This is used by PaneItem to
 * describe URIs that should launch specific panes.
 *
 * URI patterns used `{name}` placeholders to match any non-empty path segment or URI part (host, protocol) and capture
 * it as a parameter called "name". Any segment that is not recognized as a parameter will match exactly.
 *
 * Examples:
 *
 * `atom-github://hostname/exact/path?p0=value&p1=value` contains no parameters, so it will match _only_ that exact URL,
 * including query parameters and their values. Extra query parameters or a fragment (`#`) will cause the match to fail.
 *
 * `atom-github://hostname/path/{name}/fragment` will match and capture any second path segment.
 * * `atom-github://hostname/path/one/fragment` will match with `{name: 'one'}`
 * * `atom-github://hostname/path/two/fragment` will match with `{name: 'two'}`
 * * `atom-github://hostname/path/fragment` will not.
 *
 * `atom-github://hostname/root/{segments...}` will capture any number of path segments as an array. For example,
 * * `atom-github://hostname/root/foo/bar/baz/` will match with `{segments: ['foo', 'bar', 'baz']}`.
 * * `atom-github://hostname/root/single` will match with `{segments: ['single']}`; even a single segment will be
 *   matched as an array.
 * * `atom-github://hostname/root/` will match with `{segments: []}`.
 *
 * Query parameters and their values may be captured. Given: `atom-github://hostname?q={value}`
 * * `atom-github://hostname?q=foo` will match with `{value: 'foo'}`.
 * * `atom-github://hostname?q=one&q=two` will _not_ match.
 *
 * To match multiple query parameters, use a splat parameter. Given: `atom-github://hostname?q={value...}`
 * * `atom-github://hostname?q=one&q=two` will match with `{value: ['one', 'two']}`.
 * * `atom-github://hostname?q=single` will match with `{value: ['single']}`.
 * * `atom-github://hostname` will match with `{value: []}`.
 *
 * Protocol, username, password, or hostname may also contain capture expressions: `{p}://hostname`,
 * `foo://me:{password}@hostname`.
 */
class URIPattern {
  constructor(string) {
    this.original = string;

    const parsed = _url.default.parse(dashEscape(string), true);

    this.parts = {
      protocol: asPart(parsed.protocol, '', ':'),
      auth: splitAuth(parsed.auth, asPart),
      hostname: asPart(parsed.hostname),
      port: asPart(parsed.port),
      pathname: (parsed.pathname || '').split('/').slice(1).map(segment => asPart(segment)),
      query: Object.keys(parsed.query).reduce((acc, current) => {
        acc[current] = asPart(parsed.query[current]);
        return acc;
      }, {}),
      hash: asPart(parsed.hash, '#', '')
    };
  }

  matches(string) {
    if (string === undefined || string === null) {
      return nonURIMatch;
    }

    const other = _url.default.parse(string, true);

    const params = {}; // direct matches

    for (const attr of ['protocol', 'hostname', 'port', 'hash']) {
      if (!this.parts[attr].matchesIn(params, other[attr])) {
        return nonURIMatch;
      }
    } // auth


    const auth = splitAuth(other.auth);

    if (!this.parts.auth.username.matchesIn(params, auth.username)) {
      return nonURIMatch;
    }

    if (!this.parts.auth.password.matchesIn(params, auth.password)) {
      return nonURIMatch;
    } // pathname


    const pathParts = (other.pathname || '').split('/').filter(p => p.length > 0);
    let mineInd = 0;
    let yoursInd = 0;

    while (mineInd < this.parts.pathname.length && yoursInd < pathParts.length) {
      const mine = this.parts.pathname[mineInd];
      const yours = pathParts[yoursInd];

      if (!mine.matchesIn(params, yours)) {
        return nonURIMatch;
      } else {
        if (!mine.isSplat()) {
          mineInd++;
        }

        yoursInd++;
      }
    }

    while (mineInd < this.parts.pathname.length) {
      const part = this.parts.pathname[mineInd];

      if (!part.matchesEmptyIn(params)) {
        return nonURIMatch;
      }

      mineInd++;
    }

    if (yoursInd !== pathParts.length) {
      return nonURIMatch;
    } // query string


    const remaining = new Set(Object.keys(this.parts.query));

    for (const k in other.query) {
      const yours = other.query[k];
      remaining.delete(k);
      const mine = this.parts.query[k];

      if (mine === undefined) {
        return nonURIMatch;
      }

      const allYours = yours instanceof Array ? yours : [yours];

      for (const each of allYours) {
        if (!mine.matchesIn(params, each)) {
          return nonURIMatch;
        }
      }
    }

    for (const k of remaining) {
      const part = this.parts.query[k];

      if (!part.matchesEmptyIn(params)) {
        return nonURIMatch;
      }
    }

    return new URIMatch(string, params);
  } // Access the original string used to create this pattern.


  getOriginal() {
    return this.original;
  }

  toString() {
    return `<URIPattern ${this.original}>`;
  }

}
/**
 * Pattern component that matches its corresponding segment exactly.
 */


exports.default = URIPattern;

class ExactPart {
  constructor(string) {
    this.string = string;
  }

  matchesIn(params, other) {
    return other === this.string;
  }

  matchesEmptyIn(params) {
    return false;
  }

  isSplat() {
    return false;
  }

}
/**
 * Pattern component that matches and captures any non-empty corresponding segment within a URI.
 */


class CapturePart {
  constructor(name, splat, prefix, suffix) {
    this.name = name;
    this.splat = splat;
    this.prefix = prefix;
    this.suffix = suffix;
  }

  matchesIn(params, other) {
    if (this.prefix.length > 0 && other.startsWith(this.prefix)) {
      other = other.slice(this.prefix.length);
    }

    if (this.suffix.length > 0 && other.endsWith(this.suffix)) {
      other = other.slice(0, -this.suffix.length);
    }

    other = decodeURIComponent(other);

    if (this.name.length > 0) {
      if (this.splat) {
        if (params[this.name] === undefined) {
          params[this.name] = [other];
        } else {
          params[this.name].push(other);
        }
      } else {
        if (params[this.name] !== undefined) {
          return false;
        }

        params[this.name] = other;
      }
    }

    return true;
  }

  matchesEmptyIn(params) {
    if (this.splat) {
      if (params[this.name] === undefined) {
        params[this.name] = [];
      }

      return true;
    }

    return false;
  }

  isSplat() {
    return this.splat;
  }

}
/**
 * Including `{}` characters in certain URI components (hostname, protocol) cause `url.parse()` to lump everything into
 * the `pathname`. Escape brackets from a pattern with `-a` and `-z`, and literal dashes with `--`.
 */


function dashEscape(raw) {
  return raw.replace(/[{}-]/g, ch => {
    if (ch === '{') {
      return '-a';
    } else if (ch === '}') {
      return '-z';
    } else {
      return '--';
    }
  });
}
/**
 * Reverse the escaping performed by `dashEscape` by un-doubling `-` characters.
 */


function dashUnescape(escaped) {
  return escaped.replace(/--/g, '-');
}
/**
 * Parse a URI pattern component as either an `ExactPart` or a `CapturePart`. Recognize captures ending with `...` as
 * splat captures that can consume zero to many components.
 */


function asPart(patternSegment, prefix = '', suffix = '') {
  if (patternSegment === null) {
    return new ExactPart(null);
  }

  let subPattern = patternSegment;

  if (prefix.length > 0 && subPattern.startsWith(prefix)) {
    subPattern = subPattern.slice(prefix.length);
  }

  if (suffix.length > 0 && subPattern.endsWith(suffix)) {
    subPattern = subPattern.slice(0, -suffix.length);
  }

  if (subPattern.startsWith('-a') && subPattern.endsWith('-z')) {
    const splat = subPattern.endsWith('...-z');

    if (splat) {
      subPattern = subPattern.slice(2, -5);
    } else {
      subPattern = subPattern.slice(2, -2);
    }

    return new CapturePart(dashUnescape(subPattern), splat, prefix, suffix);
  } else {
    return new ExactPart(dashUnescape(patternSegment));
  }
}
/**
 * Split the `.auth` field into username and password subcomponent.
 */


function splitAuth(auth, fn = x => x) {
  if (auth === null) {
    return {
      username: fn(null),
      password: fn(null)
    };
  }

  const ind = auth.indexOf(':');
  return ind !== -1 ? {
    username: fn(auth.slice(0, ind)),
    password: fn(auth.slice(ind + 1))
  } : {
    username: fn(auth),
    password: fn(null)
  };
}
/**
 * Memorialize a successful match between a URI and a URIPattern, including any parameters that have been captured.
 */


class URIMatch {
  constructor(uri, params) {
    this.uri = uri;
    this.params = params;
  }

  ok() {
    return true;
  }

  getURI() {
    return this.uri;
  }

  getParams() {
    return this.params;
  }

  toString() {
    let s = '<URIMatch ok';

    for (const k in this.params) {
      s += ` ${k}="${this.params[k]}"`;
    }

    s += '>';
    return s;
  }

}
/**
 * Singleton object that memorializes an unsuccessful match between a URIPattern and an URI. Matches the API of a
 * URIMatch, but returns false for ok() and so on.
 */


const nonURIMatch = {
  ok() {
    return false;
  },

  getURI() {
    return undefined;
  },

  getParams() {
    return {};
  },

  toString() {
    return '<nonURIMatch>';
  }

};
exports.nonURIMatch = nonURIMatch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9hdG9tL3VyaS1wYXR0ZXJuLmpzIl0sIm5hbWVzIjpbIlVSSVBhdHRlcm4iLCJjb25zdHJ1Y3RvciIsInN0cmluZyIsIm9yaWdpbmFsIiwicGFyc2VkIiwidXJsIiwicGFyc2UiLCJkYXNoRXNjYXBlIiwicGFydHMiLCJwcm90b2NvbCIsImFzUGFydCIsImF1dGgiLCJzcGxpdEF1dGgiLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInNwbGl0Iiwic2xpY2UiLCJtYXAiLCJzZWdtZW50IiwicXVlcnkiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwiYWNjIiwiY3VycmVudCIsImhhc2giLCJtYXRjaGVzIiwidW5kZWZpbmVkIiwibm9uVVJJTWF0Y2giLCJvdGhlciIsInBhcmFtcyIsImF0dHIiLCJtYXRjaGVzSW4iLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwicGF0aFBhcnRzIiwiZmlsdGVyIiwicCIsImxlbmd0aCIsIm1pbmVJbmQiLCJ5b3Vyc0luZCIsIm1pbmUiLCJ5b3VycyIsImlzU3BsYXQiLCJwYXJ0IiwibWF0Y2hlc0VtcHR5SW4iLCJyZW1haW5pbmciLCJTZXQiLCJrIiwiZGVsZXRlIiwiYWxsWW91cnMiLCJBcnJheSIsImVhY2giLCJVUklNYXRjaCIsImdldE9yaWdpbmFsIiwidG9TdHJpbmciLCJFeGFjdFBhcnQiLCJDYXB0dXJlUGFydCIsIm5hbWUiLCJzcGxhdCIsInByZWZpeCIsInN1ZmZpeCIsInN0YXJ0c1dpdGgiLCJlbmRzV2l0aCIsImRlY29kZVVSSUNvbXBvbmVudCIsInB1c2giLCJyYXciLCJyZXBsYWNlIiwiY2giLCJkYXNoVW5lc2NhcGUiLCJlc2NhcGVkIiwicGF0dGVyblNlZ21lbnQiLCJzdWJQYXR0ZXJuIiwiZm4iLCJ4IiwiaW5kIiwiaW5kZXhPZiIsInVyaSIsIm9rIiwiZ2V0VVJJIiwiZ2V0UGFyYW1zIiwicyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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TDtBQUNBLFdBQU9BLENBQVA7QUFDRDs7QUF6Qlk7QUE0QmY7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLE1BQU1yRCxXQUFXLEdBQUc7QUFDekJrRCxFQUFBQSxFQUFFLEdBQUc7QUFDSCxXQUFPLEtBQVA7QUFDRCxHQUh3Qjs7QUFLekJDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFdBQU9wRCxTQUFQO0FBQ0QsR0FQd0I7O0FBU3pCcUQsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTyxFQUFQO0FBQ0QsR0FYd0I7O0FBYXpCekIsRUFBQUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxlQUFQO0FBQ0Q7O0FBZndCLENBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG4vKipcbiAqIE1hdGNoIGFuZCBjYXB0dXJlIHBhcnRzIG9mIGEgVVJJLCBsaWtlIGEgc3BlY2lhbGl6ZWQgZGlhbGVjdCBvZiByZWd1bGFyIGV4cHJlc3Npb24uIFRoaXMgaXMgdXNlZCBieSBQYW5lSXRlbSB0b1xuICogZGVzY3JpYmUgVVJJcyB0aGF0IHNob3VsZCBsYXVuY2ggc3BlY2lmaWMgcGFuZXMuXG4gKlxuICogVVJJIHBhdHRlcm5zIHVzZWQgYHtuYW1lfWAgcGxhY2Vob2xkZXJzIHRvIG1hdGNoIGFueSBub24tZW1wdHkgcGF0aCBzZWdtZW50IG9yIFVSSSBwYXJ0IChob3N0LCBwcm90b2NvbCkgYW5kIGNhcHR1cmVcbiAqIGl0IGFzIGEgcGFyYW1ldGVyIGNhbGxlZCBcIm5hbWVcIi4gQW55IHNlZ21lbnQgdGhhdCBpcyBub3QgcmVjb2duaXplZCBhcyBhIHBhcmFtZXRlciB3aWxsIG1hdGNoIGV4YWN0bHkuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvZXhhY3QvcGF0aD9wMD12YWx1ZSZwMT12YWx1ZWAgY29udGFpbnMgbm8gcGFyYW1ldGVycywgc28gaXQgd2lsbCBtYXRjaCBfb25seV8gdGhhdCBleGFjdCBVUkwsXG4gKiBpbmNsdWRpbmcgcXVlcnkgcGFyYW1ldGVycyBhbmQgdGhlaXIgdmFsdWVzLiBFeHRyYSBxdWVyeSBwYXJhbWV0ZXJzIG9yIGEgZnJhZ21lbnQgKGAjYCkgd2lsbCBjYXVzZSB0aGUgbWF0Y2ggdG8gZmFpbC5cbiAqXG4gKiBgYXRvbS1naXRodWI6Ly9ob3N0bmFtZS9wYXRoL3tuYW1lfS9mcmFnbWVudGAgd2lsbCBtYXRjaCBhbmQgY2FwdHVyZSBhbnkgc2Vjb25kIHBhdGggc2VnbWVudC5cbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcGF0aC9vbmUvZnJhZ21lbnRgIHdpbGwgbWF0Y2ggd2l0aCBge25hbWU6ICdvbmUnfWBcbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcGF0aC90d28vZnJhZ21lbnRgIHdpbGwgbWF0Y2ggd2l0aCBge25hbWU6ICd0d28nfWBcbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcGF0aC9mcmFnbWVudGAgd2lsbCBub3QuXG4gKlxuICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcm9vdC97c2VnbWVudHMuLi59YCB3aWxsIGNhcHR1cmUgYW55IG51bWJlciBvZiBwYXRoIHNlZ21lbnRzIGFzIGFuIGFycmF5LiBGb3IgZXhhbXBsZSxcbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcm9vdC9mb28vYmFyL2Jhei9gIHdpbGwgbWF0Y2ggd2l0aCBge3NlZ21lbnRzOiBbJ2ZvbycsICdiYXInLCAnYmF6J119YC5cbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWUvcm9vdC9zaW5nbGVgIHdpbGwgbWF0Y2ggd2l0aCBge3NlZ21lbnRzOiBbJ3NpbmdsZSddfWA7IGV2ZW4gYSBzaW5nbGUgc2VnbWVudCB3aWxsIGJlXG4gKiAgIG1hdGNoZWQgYXMgYW4gYXJyYXkuXG4gKiAqIGBhdG9tLWdpdGh1YjovL2hvc3RuYW1lL3Jvb3QvYCB3aWxsIG1hdGNoIHdpdGggYHtzZWdtZW50czogW119YC5cbiAqXG4gKiBRdWVyeSBwYXJhbWV0ZXJzIGFuZCB0aGVpciB2YWx1ZXMgbWF5IGJlIGNhcHR1cmVkLiBHaXZlbjogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWU/cT17dmFsdWV9YFxuICogKiBgYXRvbS1naXRodWI6Ly9ob3N0bmFtZT9xPWZvb2Agd2lsbCBtYXRjaCB3aXRoIGB7dmFsdWU6ICdmb28nfWAuXG4gKiAqIGBhdG9tLWdpdGh1YjovL2hvc3RuYW1lP3E9b25lJnE9dHdvYCB3aWxsIF9ub3RfIG1hdGNoLlxuICpcbiAqIFRvIG1hdGNoIG11bHRpcGxlIHF1ZXJ5IHBhcmFtZXRlcnMsIHVzZSBhIHNwbGF0IHBhcmFtZXRlci4gR2l2ZW46IGBhdG9tLWdpdGh1YjovL2hvc3RuYW1lP3E9e3ZhbHVlLi4ufWBcbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWU/cT1vbmUmcT10d29gIHdpbGwgbWF0Y2ggd2l0aCBge3ZhbHVlOiBbJ29uZScsICd0d28nXX1gLlxuICogKiBgYXRvbS1naXRodWI6Ly9ob3N0bmFtZT9xPXNpbmdsZWAgd2lsbCBtYXRjaCB3aXRoIGB7dmFsdWU6IFsnc2luZ2xlJ119YC5cbiAqICogYGF0b20tZ2l0aHViOi8vaG9zdG5hbWVgIHdpbGwgbWF0Y2ggd2l0aCBge3ZhbHVlOiBbXX1gLlxuICpcbiAqIFByb3RvY29sLCB1c2VybmFtZSwgcGFzc3dvcmQsIG9yIGhvc3RuYW1lIG1heSBhbHNvIGNvbnRhaW4gY2FwdHVyZSBleHByZXNzaW9uczogYHtwfTovL2hvc3RuYW1lYCxcbiAqIGBmb286Ly9tZTp7cGFzc3dvcmR9QGhvc3RuYW1lYC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVVJJUGF0dGVybiB7XG4gIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgIHRoaXMub3JpZ2luYWwgPSBzdHJpbmc7XG5cbiAgICBjb25zdCBwYXJzZWQgPSB1cmwucGFyc2UoZGFzaEVzY2FwZShzdHJpbmcpLCB0cnVlKTtcbiAgICB0aGlzLnBhcnRzID0ge1xuICAgICAgcHJvdG9jb2w6IGFzUGFydChwYXJzZWQucHJvdG9jb2wsICcnLCAnOicpLFxuICAgICAgYXV0aDogc3BsaXRBdXRoKHBhcnNlZC5hdXRoLCBhc1BhcnQpLFxuICAgICAgaG9zdG5hbWU6IGFzUGFydChwYXJzZWQuaG9zdG5hbWUpLFxuICAgICAgcG9ydDogYXNQYXJ0KHBhcnNlZC5wb3J0KSxcbiAgICAgIHBhdGhuYW1lOiAocGFyc2VkLnBhdGhuYW1lIHx8ICcnKS5zcGxpdCgnLycpLnNsaWNlKDEpLm1hcChzZWdtZW50ID0+IGFzUGFydChzZWdtZW50KSksXG4gICAgICBxdWVyeTogT2JqZWN0LmtleXMocGFyc2VkLnF1ZXJ5KS5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGN1cnJlbnQpID0+IHtcbiAgICAgICAgICBhY2NbY3VycmVudF0gPSBhc1BhcnQocGFyc2VkLnF1ZXJ5W2N1cnJlbnRdKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LFxuICAgICAgICB7fSxcbiAgICAgICksXG4gICAgICBoYXNoOiBhc1BhcnQocGFyc2VkLmhhc2gsICcjJywgJycpLFxuICAgIH07XG4gIH1cblxuICBtYXRjaGVzKHN0cmluZykge1xuICAgIGlmIChzdHJpbmcgPT09IHVuZGVmaW5lZCB8fCBzdHJpbmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBub25VUklNYXRjaDtcbiAgICB9XG5cbiAgICBjb25zdCBvdGhlciA9IHVybC5wYXJzZShzdHJpbmcsIHRydWUpO1xuICAgIGNvbnN0IHBhcmFtcyA9IHt9O1xuXG4gICAgLy8gZGlyZWN0IG1hdGNoZXNcbiAgICBmb3IgKGNvbnN0IGF0dHIgb2YgWydwcm90b2NvbCcsICdob3N0bmFtZScsICdwb3J0JywgJ2hhc2gnXSkge1xuICAgICAgaWYgKCF0aGlzLnBhcnRzW2F0dHJdLm1hdGNoZXNJbihwYXJhbXMsIG90aGVyW2F0dHJdKSkge1xuICAgICAgICByZXR1cm4gbm9uVVJJTWF0Y2g7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXV0aFxuICAgIGNvbnN0IGF1dGggPSBzcGxpdEF1dGgob3RoZXIuYXV0aCk7XG4gICAgaWYgKCF0aGlzLnBhcnRzLmF1dGgudXNlcm5hbWUubWF0Y2hlc0luKHBhcmFtcywgYXV0aC51c2VybmFtZSkpIHtcbiAgICAgIHJldHVybiBub25VUklNYXRjaDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBhcnRzLmF1dGgucGFzc3dvcmQubWF0Y2hlc0luKHBhcmFtcywgYXV0aC5wYXNzd29yZCkpIHtcbiAgICAgIHJldHVybiBub25VUklNYXRjaDtcbiAgICB9XG5cbiAgICAvLyBwYXRobmFtZVxuICAgIGNvbnN0IHBhdGhQYXJ0cyA9IChvdGhlci5wYXRobmFtZSB8fCAnJykuc3BsaXQoJy8nKS5maWx0ZXIocCA9PiBwLmxlbmd0aCA+IDApO1xuICAgIGxldCBtaW5lSW5kID0gMDtcbiAgICBsZXQgeW91cnNJbmQgPSAwO1xuICAgIHdoaWxlIChtaW5lSW5kIDwgdGhpcy5wYXJ0cy5wYXRobmFtZS5sZW5ndGggJiYgeW91cnNJbmQgPCBwYXRoUGFydHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBtaW5lID0gdGhpcy5wYXJ0cy5wYXRobmFtZVttaW5lSW5kXTtcbiAgICAgIGNvbnN0IHlvdXJzID0gcGF0aFBhcnRzW3lvdXJzSW5kXTtcblxuICAgICAgaWYgKCFtaW5lLm1hdGNoZXNJbihwYXJhbXMsIHlvdXJzKSkge1xuICAgICAgICByZXR1cm4gbm9uVVJJTWF0Y2g7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW1pbmUuaXNTcGxhdCgpKSB7XG4gICAgICAgICAgbWluZUluZCsrO1xuICAgICAgICB9XG4gICAgICAgIHlvdXJzSW5kKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgd2hpbGUgKG1pbmVJbmQgPCB0aGlzLnBhcnRzLnBhdGhuYW1lLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFydCA9IHRoaXMucGFydHMucGF0aG5hbWVbbWluZUluZF07XG4gICAgICBpZiAoIXBhcnQubWF0Y2hlc0VtcHR5SW4ocGFyYW1zKSkge1xuICAgICAgICByZXR1cm4gbm9uVVJJTWF0Y2g7XG4gICAgICB9XG4gICAgICBtaW5lSW5kKys7XG4gICAgfVxuXG4gICAgaWYgKHlvdXJzSW5kICE9PSBwYXRoUGFydHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbm9uVVJJTWF0Y2g7XG4gICAgfVxuXG4gICAgLy8gcXVlcnkgc3RyaW5nXG4gICAgY29uc3QgcmVtYWluaW5nID0gbmV3IFNldChPYmplY3Qua2V5cyh0aGlzLnBhcnRzLnF1ZXJ5KSk7XG4gICAgZm9yIChjb25zdCBrIGluIG90aGVyLnF1ZXJ5KSB7XG4gICAgICBjb25zdCB5b3VycyA9IG90aGVyLnF1ZXJ5W2tdO1xuICAgICAgcmVtYWluaW5nLmRlbGV0ZShrKTtcblxuICAgICAgY29uc3QgbWluZSA9IHRoaXMucGFydHMucXVlcnlba107XG4gICAgICBpZiAobWluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBub25VUklNYXRjaDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWxsWW91cnMgPSB5b3VycyBpbnN0YW5jZW9mIEFycmF5ID8geW91cnMgOiBbeW91cnNdO1xuXG4gICAgICBmb3IgKGNvbnN0IGVhY2ggb2YgYWxsWW91cnMpIHtcbiAgICAgICAgaWYgKCFtaW5lLm1hdGNoZXNJbihwYXJhbXMsIGVhY2gpKSB7XG4gICAgICAgICAgcmV0dXJuIG5vblVSSU1hdGNoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrIG9mIHJlbWFpbmluZykge1xuICAgICAgY29uc3QgcGFydCA9IHRoaXMucGFydHMucXVlcnlba107XG4gICAgICBpZiAoIXBhcnQubWF0Y2hlc0VtcHR5SW4ocGFyYW1zKSkge1xuICAgICAgICByZXR1cm4gbm9uVVJJTWF0Y2g7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBVUklNYXRjaChzdHJpbmcsIHBhcmFtcyk7XG4gIH1cblxuICAvLyBBY2Nlc3MgdGhlIG9yaWdpbmFsIHN0cmluZyB1c2VkIHRvIGNyZWF0ZSB0aGlzIHBhdHRlcm4uXG4gIGdldE9yaWdpbmFsKCkge1xuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGA8VVJJUGF0dGVybiAke3RoaXMub3JpZ2luYWx9PmA7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXR0ZXJuIGNvbXBvbmVudCB0aGF0IG1hdGNoZXMgaXRzIGNvcnJlc3BvbmRpbmcgc2VnbWVudCBleGFjdGx5LlxuICovXG5jbGFzcyBFeGFjdFBhcnQge1xuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgfVxuXG4gIG1hdGNoZXNJbihwYXJhbXMsIG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyID09PSB0aGlzLnN0cmluZztcbiAgfVxuXG4gIG1hdGNoZXNFbXB0eUluKHBhcmFtcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzU3BsYXQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogUGF0dGVybiBjb21wb25lbnQgdGhhdCBtYXRjaGVzIGFuZCBjYXB0dXJlcyBhbnkgbm9uLWVtcHR5IGNvcnJlc3BvbmRpbmcgc2VnbWVudCB3aXRoaW4gYSBVUkkuXG4gKi9cbmNsYXNzIENhcHR1cmVQYXJ0IHtcbiAgY29uc3RydWN0b3IobmFtZSwgc3BsYXQsIHByZWZpeCwgc3VmZml4KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNwbGF0ID0gc3BsYXQ7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXg7XG4gICAgdGhpcy5zdWZmaXggPSBzdWZmaXg7XG4gIH1cblxuICBtYXRjaGVzSW4ocGFyYW1zLCBvdGhlcikge1xuICAgIGlmICh0aGlzLnByZWZpeC5sZW5ndGggPiAwICYmIG90aGVyLnN0YXJ0c1dpdGgodGhpcy5wcmVmaXgpKSB7XG4gICAgICBvdGhlciA9IG90aGVyLnNsaWNlKHRoaXMucHJlZml4Lmxlbmd0aCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN1ZmZpeC5sZW5ndGggPiAwICYmIG90aGVyLmVuZHNXaXRoKHRoaXMuc3VmZml4KSkge1xuICAgICAgb3RoZXIgPSBvdGhlci5zbGljZSgwLCAtdGhpcy5zdWZmaXgubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBvdGhlciA9IGRlY29kZVVSSUNvbXBvbmVudChvdGhlcik7XG5cbiAgICBpZiAodGhpcy5uYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aGlzLnNwbGF0KSB7XG4gICAgICAgIGlmIChwYXJhbXNbdGhpcy5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcGFyYW1zW3RoaXMubmFtZV0gPSBbb3RoZXJdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmFtc1t0aGlzLm5hbWVdLnB1c2gob3RoZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGFyYW1zW3RoaXMubmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbXNbdGhpcy5uYW1lXSA9IG90aGVyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1hdGNoZXNFbXB0eUluKHBhcmFtcykge1xuICAgIGlmICh0aGlzLnNwbGF0KSB7XG4gICAgICBpZiAocGFyYW1zW3RoaXMubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXJhbXNbdGhpcy5uYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNTcGxhdCgpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxhdDtcbiAgfVxufVxuXG4vKipcbiAqIEluY2x1ZGluZyBge31gIGNoYXJhY3RlcnMgaW4gY2VydGFpbiBVUkkgY29tcG9uZW50cyAoaG9zdG5hbWUsIHByb3RvY29sKSBjYXVzZSBgdXJsLnBhcnNlKClgIHRvIGx1bXAgZXZlcnl0aGluZyBpbnRvXG4gKiB0aGUgYHBhdGhuYW1lYC4gRXNjYXBlIGJyYWNrZXRzIGZyb20gYSBwYXR0ZXJuIHdpdGggYC1hYCBhbmQgYC16YCwgYW5kIGxpdGVyYWwgZGFzaGVzIHdpdGggYC0tYC5cbiAqL1xuZnVuY3Rpb24gZGFzaEVzY2FwZShyYXcpIHtcbiAgcmV0dXJuIHJhdy5yZXBsYWNlKC9be30tXS9nLCBjaCA9PiB7XG4gICAgaWYgKGNoID09PSAneycpIHtcbiAgICAgIHJldHVybiAnLWEnO1xuICAgIH0gZWxzZSBpZiAoY2ggPT09ICd9Jykge1xuICAgICAgcmV0dXJuICcteic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnLS0nO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogUmV2ZXJzZSB0aGUgZXNjYXBpbmcgcGVyZm9ybWVkIGJ5IGBkYXNoRXNjYXBlYCBieSB1bi1kb3VibGluZyBgLWAgY2hhcmFjdGVycy5cbiAqL1xuZnVuY3Rpb24gZGFzaFVuZXNjYXBlKGVzY2FwZWQpIHtcbiAgcmV0dXJuIGVzY2FwZWQucmVwbGFjZSgvLS0vZywgJy0nKTtcbn1cblxuLyoqXG4gKiBQYXJzZSBhIFVSSSBwYXR0ZXJuIGNvbXBvbmVudCBhcyBlaXRoZXIgYW4gYEV4YWN0UGFydGAgb3IgYSBgQ2FwdHVyZVBhcnRgLiBSZWNvZ25pemUgY2FwdHVyZXMgZW5kaW5nIHdpdGggYC4uLmAgYXNcbiAqIHNwbGF0IGNhcHR1cmVzIHRoYXQgY2FuIGNvbnN1bWUgemVybyB0byBtYW55IGNvbXBvbmVudHMuXG4gKi9cbmZ1bmN0aW9uIGFzUGFydChwYXR0ZXJuU2VnbWVudCwgcHJlZml4ID0gJycsIHN1ZmZpeCA9ICcnKSB7XG4gIGlmIChwYXR0ZXJuU2VnbWVudCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgRXhhY3RQYXJ0KG51bGwpO1xuICB9XG5cbiAgbGV0IHN1YlBhdHRlcm4gPSBwYXR0ZXJuU2VnbWVudDtcbiAgaWYgKHByZWZpeC5sZW5ndGggPiAwICYmIHN1YlBhdHRlcm4uc3RhcnRzV2l0aChwcmVmaXgpKSB7XG4gICAgc3ViUGF0dGVybiA9IHN1YlBhdHRlcm4uc2xpY2UocHJlZml4Lmxlbmd0aCk7XG4gIH1cbiAgaWYgKHN1ZmZpeC5sZW5ndGggPiAwICYmIHN1YlBhdHRlcm4uZW5kc1dpdGgoc3VmZml4KSkge1xuICAgIHN1YlBhdHRlcm4gPSBzdWJQYXR0ZXJuLnNsaWNlKDAsIC1zdWZmaXgubGVuZ3RoKTtcbiAgfVxuXG4gIGlmIChzdWJQYXR0ZXJuLnN0YXJ0c1dpdGgoJy1hJykgJiYgc3ViUGF0dGVybi5lbmRzV2l0aCgnLXonKSkge1xuICAgIGNvbnN0IHNwbGF0ID0gc3ViUGF0dGVybi5lbmRzV2l0aCgnLi4uLXonKTtcbiAgICBpZiAoc3BsYXQpIHtcbiAgICAgIHN1YlBhdHRlcm4gPSBzdWJQYXR0ZXJuLnNsaWNlKDIsIC01KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViUGF0dGVybiA9IHN1YlBhdHRlcm4uc2xpY2UoMiwgLTIpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ2FwdHVyZVBhcnQoZGFzaFVuZXNjYXBlKHN1YlBhdHRlcm4pLCBzcGxhdCwgcHJlZml4LCBzdWZmaXgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRXhhY3RQYXJ0KGRhc2hVbmVzY2FwZShwYXR0ZXJuU2VnbWVudCkpO1xuICB9XG59XG5cbi8qKlxuICogU3BsaXQgdGhlIGAuYXV0aGAgZmllbGQgaW50byB1c2VybmFtZSBhbmQgcGFzc3dvcmQgc3ViY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBzcGxpdEF1dGgoYXV0aCwgZm4gPSB4ID0+IHgpIHtcbiAgaWYgKGF1dGggPT09IG51bGwpIHtcbiAgICByZXR1cm4ge3VzZXJuYW1lOiBmbihudWxsKSwgcGFzc3dvcmQ6IGZuKG51bGwpfTtcbiAgfVxuXG4gIGNvbnN0IGluZCA9IGF1dGguaW5kZXhPZignOicpO1xuICByZXR1cm4gaW5kICE9PSAtMVxuICAgID8ge3VzZXJuYW1lOiBmbihhdXRoLnNsaWNlKDAsIGluZCkpLCBwYXNzd29yZDogZm4oYXV0aC5zbGljZShpbmQgKyAxKSl9XG4gICAgOiB7dXNlcm5hbWU6IGZuKGF1dGgpLCBwYXNzd29yZDogZm4obnVsbCl9O1xufVxuXG4vKipcbiAqIE1lbW9yaWFsaXplIGEgc3VjY2Vzc2Z1bCBtYXRjaCBiZXR3ZWVuIGEgVVJJIGFuZCBhIFVSSVBhdHRlcm4sIGluY2x1ZGluZyBhbnkgcGFyYW1ldGVycyB0aGF0IGhhdmUgYmVlbiBjYXB0dXJlZC5cbiAqL1xuY2xhc3MgVVJJTWF0Y2gge1xuICBjb25zdHJ1Y3Rvcih1cmksIHBhcmFtcykge1xuICAgIHRoaXMudXJpID0gdXJpO1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICB9XG5cbiAgb2soKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJpO1xuICB9XG5cbiAgZ2V0UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcztcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCBzID0gJzxVUklNYXRjaCBvayc7XG4gICAgZm9yIChjb25zdCBrIGluIHRoaXMucGFyYW1zKSB7XG4gICAgICBzICs9IGAgJHtrfT1cIiR7dGhpcy5wYXJhbXNba119XCJgO1xuICAgIH1cbiAgICBzICs9ICc+JztcbiAgICByZXR1cm4gcztcbiAgfVxufVxuXG4vKipcbiAqIFNpbmdsZXRvbiBvYmplY3QgdGhhdCBtZW1vcmlhbGl6ZXMgYW4gdW5zdWNjZXNzZnVsIG1hdGNoIGJldHdlZW4gYSBVUklQYXR0ZXJuIGFuZCBhbiBVUkkuIE1hdGNoZXMgdGhlIEFQSSBvZiBhXG4gKiBVUklNYXRjaCwgYnV0IHJldHVybnMgZmFsc2UgZm9yIG9rKCkgYW5kIHNvIG9uLlxuICovXG5leHBvcnQgY29uc3Qgbm9uVVJJTWF0Y2ggPSB7XG4gIG9rKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSxcblxuICBnZXRQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnPG5vblVSSU1hdGNoPic7XG4gIH0sXG59O1xuIl19