"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullFile = exports.default = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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