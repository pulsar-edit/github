"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoopVisitor = void 0;

/*
 * Conflict parser visitor that ignores all events.
 */
class NoopVisitor {
  visitOurSide(position, bannerRow, textRowStart, textRowEnd) {}

  visitBaseSide(position, bannerRow, textRowStart, textRowEnd) {}

  visitSeparator(sepRowStart) {}

  visitTheirSide(position, bannerRow, textRowStart, textRowEnd) {}

}

exports.NoopVisitor = NoopVisitor;