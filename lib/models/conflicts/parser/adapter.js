"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChunkAdapter = exports.EditorAdapter = void 0;

/*
 * Input adapter to facilitate parsing conflicts from text loaded into an Editor.
 */
class EditorAdapter {
  constructor(editor, startRow) {
    this.editor = editor;
    this.currentRow = startRow;
  }

  getCurrentRow() {
    return this.currentRow;
  }

  getCurrentLine() {
    return this.editor.lineTextForBufferRow(this.currentRow);
  }

  advanceRow() {
    this.currentRow++;
  }

  isAtEnd() {
    return this.currentRow > this.editor.getLastBufferRow();
  }

}
/*
 * Input adapter for parsing conflicts from a chunk of text arriving from a ReadStream.
 */


exports.EditorAdapter = EditorAdapter;

class ChunkAdapter {
  constructor(chunk) {
    this.chunk = chunk;
    this.lineEndRx = /\r?\n/g;
    this.lineStartPosition = 0;
    this.eof = false;
    this.advanceRow();
  }

  advanceTo(pattern) {
    if (this.eof) {
      return false;
    }

    const rx = new RegExp(pattern.source, 'gm');
    rx.lastIndex = this.lineStartPosition;
    const match = rx.exec(this.chunk);

    if (match) {
      this.lineEndRx.lastIndex = match.index;
      return true;
    } else {
      return false;
    }
  }

  getCurrentRow() {
    return undefined;
  }

  getCurrentLine() {
    return this.currentLine;
  }

  advanceRow() {
    this.lineStartPosition = this.lineEndRx.lastIndex;

    if (this.lineEndRx.test(this.chunk)) {
      this.currentLine = this.chunk.slice(this.lineStartPosition, this.lineEndRx.lastIndex);
    } else {
      this.currentLine = this.chunk.slice(this.lineStartPosition);
      this.eof = true;
    }
  }

  isAtEnd() {
    return this.eof;
  }

  getLastPartialMarker() {
    const match = /[<|>=]{1,7} ?[^\r\n]*\r?$/.exec(this.chunk);
    return match ? match[0] : '';
  }

}

exports.ChunkAdapter = ChunkAdapter;