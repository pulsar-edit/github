"use strict";

var _githubPackage = _interopRequireDefault(require("./github-package"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let pack;
const entry = {
  initialize() {
    pack = new _githubPackage.default({
      workspace: atom.workspace,
      project: atom.project,
      commands: atom.commands,
      notificationManager: atom.notifications,
      tooltips: atom.tooltips,
      styles: atom.styles,
      keymaps: atom.keymaps,
      grammars: atom.grammars,
      config: atom.config,
      deserializers: atom.deserializers,
      confirm: atom.confirm.bind(atom),
      getLoadSettings: atom.getLoadSettings.bind(atom),
      currentWindow: atom.getCurrentWindow(),
      configDirPath: atom.getConfigDirPath()
    });
  }

};
module.exports = new Proxy(entry, {
  get(target, name) {
    if (pack && Reflect.has(pack, name)) {
      let item = pack[name];

      if (typeof item === 'function') {
        item = item.bind(pack);
      }

      return item;
    } else {
      return target[name];
    }
  }

});