"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BOTTOM = exports.MIDDLE = exports.TOP = void 0;

class Position {
  constructor(name, cssClass) {
    this.name = name.toLowerCase();
    this.cssClass = cssClass;
  }

  getName() {
    return this.name;
  }

  when(actions) {
    const chosen = actions[this.name] || actions.default || (() => {
      throw new Error(`Unexpected conflict side position: ${this.name}`);
    });

    return chosen();
  }

  getBlockCSSClass() {
    return this.cssClass + 'Block';
  }

  toString() {
    return `<Position: ${this.name.toUpperCase()}>`;
  }

}

const TOP = new Position('TOP', 'github-ConflictTop');
exports.TOP = TOP;
const MIDDLE = new Position('MIDDLE', 'github-ConflictMiddle');
exports.MIDDLE = MIDDLE;
const BOTTOM = new Position('BOTTOM', 'github-ConflictBottom');
exports.BOTTOM = BOTTOM;