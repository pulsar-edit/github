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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJGaWxlIiwiY29uc3RydWN0b3IiLCJwYXRoIiwibW9kZSIsInN5bWxpbmsiLCJnZXRQYXRoIiwiZ2V0TW9kZSIsImdldFN5bWxpbmsiLCJpc1N5bWxpbmsiLCJtb2RlcyIsIlNZTUxJTksiLCJpc1JlZ3VsYXJGaWxlIiwiTk9STUFMIiwiRVhFQ1VUQUJMRSIsImlzRXhlY3V0YWJsZSIsImlzUHJlc2VudCIsImNsb25lIiwib3B0cyIsInVuZGVmaW5lZCIsIkdJVExJTksiLCJudWxsRmlsZSJdLCJzb3VyY2VzIjpbImZpbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZSB7XG4gIHN0YXRpYyBtb2RlcyA9IHtcbiAgICAvLyBOb24tZXhlY3V0YWJsZSwgbm9uLXN5bWxpbmtcbiAgICBOT1JNQUw6ICcxMDA2NDQnLFxuXG4gICAgLy8gK3ggYml0IHNldFxuICAgIEVYRUNVVEFCTEU6ICcxMDA3NTUnLFxuXG4gICAgLy8gU29mdCBsaW5rIHRvIGFub3RoZXIgZmlsZXN5c3RlbSBsb2NhdGlvblxuICAgIFNZTUxJTks6ICcxMjAwMDAnLFxuXG4gICAgLy8gU3VibW9kdWxlIG1vdW50IHBvaW50XG4gICAgR0lUTElOSzogJzE2MDAwMCcsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7cGF0aCwgbW9kZSwgc3ltbGlua30pIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgIHRoaXMubW9kZSA9IG1vZGU7XG4gICAgdGhpcy5zeW1saW5rID0gc3ltbGluaztcbiAgfVxuXG4gIGdldFBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aDtcbiAgfVxuXG4gIGdldE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZTtcbiAgfVxuXG4gIGdldFN5bWxpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ltbGluaztcbiAgfVxuXG4gIGlzU3ltbGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlKCkgPT09IHRoaXMuY29uc3RydWN0b3IubW9kZXMuU1lNTElOSztcbiAgfVxuXG4gIGlzUmVndWxhckZpbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9kZSgpID09PSB0aGlzLmNvbnN0cnVjdG9yLm1vZGVzLk5PUk1BTCB8fCB0aGlzLmdldE1vZGUoKSA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5tb2Rlcy5FWEVDVVRBQkxFO1xuICB9XG5cbiAgaXNFeGVjdXRhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmdldE1vZGUoKSA9PT0gdGhpcy5jb25zdHJ1Y3Rvci5tb2Rlcy5FWEVDVVRBQkxFO1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2xvbmUob3B0cyA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBGaWxlKHtcbiAgICAgIHBhdGg6IG9wdHMucGF0aCAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRoIDogdGhpcy5wYXRoLFxuICAgICAgbW9kZTogb3B0cy5tb2RlICE9PSB1bmRlZmluZWQgPyBvcHRzLm1vZGUgOiB0aGlzLm1vZGUsXG4gICAgICBzeW1saW5rOiBvcHRzLnN5bWxpbmsgIT09IHVuZGVmaW5lZCA/IG9wdHMuc3ltbGluayA6IHRoaXMuc3ltbGluayxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbnVsbEZpbGUgPSB7XG4gIGdldFBhdGgoKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBnZXRNb2RlKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgZ2V0U3ltbGluaygpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIGlzU3ltbGluaygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgaXNSZWd1bGFyRmlsZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgaXNFeGVjdXRhYmxlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBpc1ByZXNlbnQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGNsb25lKG9wdHMgPSB7fSkge1xuICAgIGlmIChvcHRzLnBhdGggPT09IHVuZGVmaW5lZCAmJiBvcHRzLm1vZGUgPT09IHVuZGVmaW5lZCAmJiBvcHRzLnN5bWxpbmsgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRmlsZSh7XG4gICAgICAgIHBhdGg6IG9wdHMucGF0aCAhPT0gdW5kZWZpbmVkID8gb3B0cy5wYXRoIDogdGhpcy5nZXRQYXRoKCksXG4gICAgICAgIG1vZGU6IG9wdHMubW9kZSAhPT0gdW5kZWZpbmVkID8gb3B0cy5tb2RlIDogdGhpcy5nZXRNb2RlKCksXG4gICAgICAgIHN5bWxpbms6IG9wdHMuc3ltbGluayAhPT0gdW5kZWZpbmVkID8gb3B0cy5zeW1saW5rIDogdGhpcy5nZXRTeW1saW5rKCksXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBZSxNQUFNQSxJQUFJLENBQUM7RUFleEJDLFdBQVcsQ0FBQztJQUFDQyxJQUFJO0lBQUVDLElBQUk7SUFBRUM7RUFBTyxDQUFDLEVBQUU7SUFDakMsSUFBSSxDQUFDRixJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87RUFDeEI7RUFFQUMsT0FBTyxHQUFHO0lBQ1IsT0FBTyxJQUFJLENBQUNILElBQUk7RUFDbEI7RUFFQUksT0FBTyxHQUFHO0lBQ1IsT0FBTyxJQUFJLENBQUNILElBQUk7RUFDbEI7RUFFQUksVUFBVSxHQUFHO0lBQ1gsT0FBTyxJQUFJLENBQUNILE9BQU87RUFDckI7RUFFQUksU0FBUyxHQUFHO0lBQ1Ys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