"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullFile = exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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