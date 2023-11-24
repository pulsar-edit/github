"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BIN_SCRIPTS = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BIN_SCRIPTS = {
  getCredentialHelperJs: 'git-credential-atom.js',
  getCredentialHelperSh: 'git-credential-atom.sh',
  getAskPassJs: 'git-askpass-atom.js',
  getAskPassSh: 'git-askpass-atom.sh',
  getSshWrapperSh: 'linux-ssh-wrapper.sh',
  getGpgWrapperSh: 'gpg-wrapper.sh'
};
exports.BIN_SCRIPTS = BIN_SCRIPTS;

class GitTempDir {
  constructor() {
    this.created = false;
  }

  async ensure() {
    if (this.created) {
      return;
    }

    this.root = await (0, _helpers.getTempDir)({
      dir: process.platform === 'win32' ? _os.default.tmpdir() : '/tmp',
      prefix: 'github-',
      symlinkOk: true
    });
    await Promise.all(Object.values(BIN_SCRIPTS).map(async filename => {
      await _fsExtra.default.copy(_path.default.resolve((0, _helpers.getPackageRoot)(), 'bin', filename), _path.default.join(this.root, filename));

      if (_path.default.extname(filename) === '.sh') {
        await _fsExtra.default.chmod(_path.default.join(this.root, filename), 0o700);
      }
    }));
    this.created = true;
  }

  getRootPath() {
    return this.root;
  }

  getScriptPath(filename) {
    if (!this.created) {
      throw new Error(`Attempt to access filename ${filename} in uninitialized GitTempDir`);
    }

    return _path.default.join(this.root, filename);
  }

  getSocketOptions() {
    if (process.platform === 'win32') {
      return {
        port: 0,
        host: 'localhost'
      };
    } else {
      return {
        path: this.getScriptPath('helper.sock')
      };
    }
  }

  dispose() {
    return _fsExtra.default.remove(this.root);
  }

}

exports.default = GitTempDir;

function createGetter(key) {
  const filename = BIN_SCRIPTS[key];
  return function () {
    return this.getScriptPath(filename);
  };
}

for (const key in BIN_SCRIPTS) {
  GitTempDir.prototype[key] = createGetter(key);
}