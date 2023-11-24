"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _helpers = require("../helpers");

class StyleCalculator {
  constructor(styles, config) {
    (0, _helpers.autobind)(this, 'updateStyles');
    this.styles = styles;
    this.config = config;
  }

  startWatching(sourcePath, configsToWatch, getStylesheetFn) {
    const subscriptions = new _eventKit.CompositeDisposable();

    const updateStyles = () => {
      this.updateStyles(sourcePath, getStylesheetFn);
    };

    configsToWatch.forEach(configToWatch => {
      subscriptions.add(this.config.onDidChange(configToWatch, updateStyles));
    });
    updateStyles();
    return subscriptions;
  }

  updateStyles(sourcePath, getStylesheetFn) {
    const stylesheet = getStylesheetFn(this.config);
    this.styles.addStyleSheet(stylesheet, {
      sourcePath,
      priority: 0
    });
  }

}

exports.default = StyleCalculator;