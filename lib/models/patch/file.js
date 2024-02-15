"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullFile = exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class File {
  constructor({
    path,
    mode,
    symlink
  }) {
    this.path = path;
    this.mode = mode;
    this.symlink = symlink;
  }
  getPath() {
    return this.path;
  }
  getMode() {
    return this.mode;
  }
  getSymlink() {
    return this.symlink;
  }
  isSymlink() {
    return this.getMode() === this.constructor.modes.SYMLINK;
  }
  isRegularFile() {
    return this.getMode() === this.constructor.modes.NORMAL || this.getMode() === this.constructor.modes.EXECUTABLE;
  }
  isExecutable() {
    return this.getMode() === this.constructor.modes.EXECUTABLE;
  }
  isPresent() {
    return true;
  }
  clone(opts = {}) {
    return new File({
      path: opts.path !== undefined ? opts.path : this.path,
      mode: opts.mode !== undefined ? opts.mode : this.mode,
      symlink: opts.symlink !== undefined ? opts.symlink : this.symlink
    });
  }
}
exports.default = File;
_defineProperty(File, "modes", {
  // Non-executable, non-symlink
  NORMAL: '100644',
  // +x bit set
  EXECUTABLE: '100755',
  // Soft link to another filesystem location
  SYMLINK: '120000',
  // Submodule mount point
  GITLINK: '160000'
});
const nullFile = {
  getPath() {
    /* istanbul ignore next */
    return null;
  },
  getMode() {
    /* istanbul ignore next */
    return null;
  },
  getSymlink() {
    /* istanbul ignore next */
    return null;
  },
  isSymlink() {
    return false;
  },
  isRegularFile() {
    return false;
  },
  isExecutable() {
    return false;
  },
  isPresent() {
    return false;
  },
  clone(opts = {}) {
    if (opts.path === undefined && opts.mode === undefined && opts.symlink === undefined) {
      return this;
    } else {
      return new File({
        path: opts.path !== undefined ? opts.path : this.getPath(),
        mode: opts.mode !== undefined ? opts.mode : this.getMode(),
        symlink: opts.symlink !== undefined ? opts.symlink : this.getSymlink()
      });
    }
  }
};
exports.nullFile = nullFile;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlIiwiY29uc3RydWN0b3IiLCJwYXRoIiwibW9kZSIsInN5bWxpbmsiLCJnZXRQYXRoIiwiZ2V0TW9kZSIsImdldFN5bWxpbmsiLCJpc1N5bWxpbmsiLCJtb2RlcyIsIlNZTUxJTksiLCJpc1JlZ3VsYXJGaWxlIiwiTk9STUFMIiwiRVhFQ1VUQUJMRSIsImlzRXhlY3V0YWJsZSIsImlzUHJlc2VudCIsImNsb25lIiwib3B0cyIsInVuZGVmaW5lZCIsImV4cG9ydHMiLCJkZWZhdWx0IiwiX2RlZmluZVByb3BlcnR5IiwiR0lUTElOSyIsIm51bGxGaWxlIl0sInNvdXJjZXMiOlsiZmlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlIHtcbiAgc3RhdGljIG1vZGVzID0ge1xuICAgIC8vIE5vbi1leGVjdXRhYmxlLCBub24tc3ltbGlua1xuICAgIE5PUk1BTDogJzEwMDY0NCcsXG5cbiAgICAvLyAreCBiaXQgc2V0XG4gICAgRVhFQ1VUQUJMRTogJzEwMDc1NScsXG5cbiAgICAvLyBTb2Z0IGxpbmsgdG8gYW5vdGhlciBmaWxlc3lzdGVtIGxvY2F0aW9uXG4gICAgU1lNTElOSzogJzEyMDAwMCcsXG5cbiAgICAvLyBTdWJtb2R1bGUgbW91bnQgcG9pbnRcbiAgICBHSVRMSU5LOiAnMTYwMDAwJyxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtwYXRoLCBtb2RlLCBzeW1saW5rfSkge1xuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICB0aGlzLnN5bWxpbmsgPSBzeW1saW5rO1xuICB9XG5cbiAgZ2V0UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoO1xuICB9XG5cbiAgZ2V0TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlO1xuICB9XG5cbiAgZ2V0U3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5zeW1saW5rO1xuICB9XG5cbiAgaXNTeW1saW5rKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1vZGUoKSA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5tb2Rlcy5TWU1MSU5LO1xuICB9XG5cbiAgaXNSZWd1bGFyRmlsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlKCkgPT09IHRoaXMuY29uc3RydWN0b3IubW9kZXMuTk9STUFMIHx8IHRoaXMuZ2V0TW9kZSgpID09PSB0aGlzLmNvbnN0cnVjdG9yLm1vZGVzLkVYRUNVVEFCTEU7XG4gIH1cblxuICBpc0V4ZWN1dGFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZSgpID09PSB0aGlzLmNvbnN0cnVjdG9yLm1vZGVzLkVYRUNVVEFCTEU7XG4gIH1cblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjbG9uZShvcHRzID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEZpbGUoe1xuICAgICAgcGF0aDogb3B0cy5wYXRoICE9PSB1bmRlZmluZWQgPyBvcHRzLnBhdGggOiB0aGlzLnBhdGgsXG4gICAgICBtb2RlOiBvcHRzLm1vZGUgIT09IHVuZGVmaW5lZCA/IG9wdHMubW9kZSA6IHRoaXMubW9kZSxcbiAgICAgIHN5bWxpbms6IG9wdHMuc3ltbGluayAhPT0gdW5kZWZpbmVkID8gb3B0cy5zeW1saW5rIDogdGhpcy5zeW1saW5rLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBudWxsRmlsZSA9IHtcbiAgZ2V0UGF0aCgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIGdldE1vZGUoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBnZXRTeW1saW5rKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgaXNTeW1saW5rKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBpc1JlZ3VsYXJGaWxlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBpc0V4ZWN1dGFibGUoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGlzUHJlc2VudCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgaWYgKG9wdHMucGF0aCA9PT0gdW5kZWZpbmVkICYmIG9wdHMubW9kZSA9PT0gdW5kZWZpbmVkICYmIG9wdHMuc3ltbGluayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBGaWxlKHtcbiAgICAgICAgcGF0aDogb3B0cy5wYXRoICE9PSB1bmRlZmluZWQgPyBvcHRzLnBhdGggOiB0aGlzLmdldFBhdGgoKSxcbiAgICAgICAgbW9kZTogb3B0cy5tb2RlICE9PSB1bmRlZmluZWQgPyBvcHRzLm1vZGUgOiB0aGlzLmdldE1vZGUoKSxcbiAgICAgICAgc3ltbGluazogb3B0cy5zeW1saW5rICE9PSB1bmRlZmluZWQgPyBvcHRzLnN5bWxpbmsgOiB0aGlzLmdldFN5bWxpbmsoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFlLE1BQU1BLElBQUksQ0FBQztFQWV4QkMsV0FBV0EsQ0FBQztJQUFDQyxJQUFJO0lBQUVDLElBQUk7SUFBRUM7RUFBTyxDQUFDLEVBQUU7SUFDakMsSUFBSSxDQUFDRixJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87RUFDeEI7RUFFQUMsT0FBT0EsQ0FBQSxFQUFHO0lBQ1IsT0FBTyxJQUFJLENBQUNILElBQUk7RUFDbEI7RUFFQUksT0FBT0EsQ0FBQSxFQUFHO0lBQ1IsT0FBTyxJQUFJLENBQUNILElBQUk7RUFDbEI7RUFFQUksVUFBVUEsQ0FBQSxF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