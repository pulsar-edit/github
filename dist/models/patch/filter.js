"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_PATCH_CHARS = void 0;
exports.filter = filter;
const MAX_PATCH_CHARS = 1024 * 1024;
exports.MAX_PATCH_CHARS = MAX_PATCH_CHARS;

function filter(original) {
  let accumulating = false;
  let accumulated = '';
  let includedChars = 0;
  const removed = new Set();
  const pathRx = /\n?diff --git (?:a|b)\/(\S+) (?:a|b)\/(\S+)/y;
  let index = 0;

  while (index !== -1) {
    let include = true;
    const result = original.indexOf('\ndiff --git ', index);
    const nextIndex = result !== -1 ? result + 1 : -1;
    const patchEnd = nextIndex !== -1 ? nextIndex : original.length; // Exclude this patch if its inclusion would cause the patch to become too large.

    const patchChars = patchEnd - index + 1;

    if (includedChars + patchChars > MAX_PATCH_CHARS) {
      include = false;
    }

    if (include) {
      // Avoid copying large buffers of text around if we're including everything anyway.
      if (accumulating) {
        accumulated += original.slice(index, patchEnd);
      }

      includedChars += patchChars;
    } else {
      // If this is the first excluded patch, start by copying everything before this into "accumulated."
      if (!accumulating) {
        accumulating = true;
        accumulated = original.slice(0, index);
      } // Extract the removed filenames from the "diff --git" line.


      pathRx.lastIndex = index;
      const pathMatch = pathRx.exec(original);

      if (pathMatch) {
        removed.add(pathMatch[1]);
        removed.add(pathMatch[2]);
      }
    }

    index = nextIndex;
  }

  return {
    filtered: accumulating ? accumulated : original,
    removed
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2RlbHMvcGF0Y2gvZmlsdGVyLmpzIl0sIm5hbWVzIjpbIk1BWF9QQVRDSF9DSEFSUyIsImZpbHRlciIsIm9yaWdpbmFsIiwiYWNjdW11bGF0aW5nIiwiYWNjdW11bGF0ZWQiLCJpbmNsdWRlZENoYXJzIiwicmVtb3ZlZCIsIlNldCIsInBhdGhSeCIsImluZGV4IiwiaW5jbHVkZSIsInJlc3VsdCIsImluZGV4T2YiLCJuZXh0SW5kZXgiLCJwYXRjaEVuZCIsImxlbmd0aCIsInBhdGNoQ2hhcnMiLCJzbGljZSIsImxhc3RJbmRleCIsInBhdGhNYXRjaCIsImV4ZWMiLCJhZGQiLCJmaWx0ZXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFPLE1BQU1BLGVBQWUsR0FBRyxPQUFPLElBQS9COzs7QUFFQSxTQUFTQyxNQUFULENBQWdCQyxRQUFoQixFQUEwQjtBQUMvQixNQUFJQyxZQUFZLEdBQUcsS0FBbkI7QUFDQSxNQUFJQyxXQUFXLEdBQUcsRUFBbEI7QUFDQSxNQUFJQyxhQUFhLEdBQUcsQ0FBcEI7QUFDQSxRQUFNQyxPQUFPLEdBQUcsSUFBSUMsR0FBSixFQUFoQjtBQUNBLFFBQU1DLE1BQU0sR0FBRyw4Q0FBZjtBQUVBLE1BQUlDLEtBQUssR0FBRyxDQUFaOztBQUNBLFNBQU9BLEtBQUssS0FBSyxDQUFDLENBQWxCLEVBQXFCO0FBQ25CLFFBQUlDLE9BQU8sR0FBRyxJQUFkO0FBRUEsVUFBTUMsTUFBTSxHQUFHVCxRQUFRLENBQUNVLE9BQVQsQ0FBaUIsZUFBakIsRUFBa0NILEtBQWxDLENBQWY7QUFDQSxVQUFNSSxTQUFTLEdBQUdGLE1BQU0sS0FBSyxDQUFDLENBQVosR0FBZ0JBLE1BQU0sR0FBRyxDQUF6QixHQUE2QixDQUFDLENBQWhEO0FBQ0EsVUFBTUcsUUFBUSxHQUFHRCxTQUFTLEtBQUssQ0FBQyxDQUFmLEdBQW1CQSxTQUFuQixHQUErQlgsUUFBUSxDQUFDYSxNQUF6RCxDQUxtQixDQU9uQjs7QUFDQSxVQUFNQyxVQUFVLEdBQUdGLFFBQVEsR0FBR0wsS0FBWCxHQUFtQixDQUF0Qzs7QUFDQSxRQUFJSixhQUFhLEdBQUdXLFVBQWhCLEdBQTZCaEIsZUFBakMsRUFBa0Q7QUFDaERVLE1BQUFBLE9BQU8sR0FBRyxLQUFWO0FBQ0Q7O0FBRUQsUUFBSUEsT0FBSixFQUFhO0FBQ1g7QUFDQSxVQUFJUCxZQUFKLEVBQWtCO0FBQ2hCQyxRQUFBQSxXQUFXLElBQUlGLFFBQVEsQ0FBQ2UsS0FBVCxDQUFlUixLQUFmLEVBQXNCSyxRQUF0QixDQUFmO0FBQ0Q7O0FBQ0RULE1BQUFBLGFBQWEsSUFBSVcsVUFBakI7QUFDRCxLQU5ELE1BTU87QUFDTDtBQUNBLFVBQUksQ0FBQ2IsWUFBTCxFQUFtQjtBQUNqQkEsUUFBQUEsWUFBWSxHQUFHLElBQWY7QUFDQUMsUUFBQUEsV0FBVyxHQUFHRixRQUFRLENBQUNlLEtBQVQsQ0FBZSxDQUFmLEVBQWtCUixLQUFsQixDQUFkO0FBQ0QsT0FMSSxDQU9MOzs7QUFDQUQsTUFBQUEsTUFBTSxDQUFDVSxTQUFQLEdBQW1CVCxLQUFuQjtBQUNBLFlBQU1VLFNBQVMsR0FBR1gsTUFBTSxDQUFDWSxJQUFQLENBQVlsQixRQUFaLENBQWxCOztBQUNBLFVBQUlpQixTQUFKLEVBQWU7QUFDYmIsUUFBQUEsT0FBTyxDQUFDZSxHQUFSLENBQVlGLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0FiLFFBQUFBLE9BQU8sQ0FBQ2UsR0FBUixDQUFZRixTQUFTLENBQUMsQ0FBRCxDQUFyQjtBQUNEO0FBQ0Y7O0FBRURWLElBQUFBLEtBQUssR0FBR0ksU0FBUjtBQUNEOztBQUVELFNBQU87QUFBQ1MsSUFBQUEsUUFBUSxFQUFFbkIsWUFBWSxHQUFHQyxXQUFILEdBQWlCRixRQUF4QztBQUFrREksSUFBQUE7QUFBbEQsR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IE1BWF9QQVRDSF9DSEFSUyA9IDEwMjQgKiAxMDI0O1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKG9yaWdpbmFsKSB7XG4gIGxldCBhY2N1bXVsYXRpbmcgPSBmYWxzZTtcbiAgbGV0IGFjY3VtdWxhdGVkID0gJyc7XG4gIGxldCBpbmNsdWRlZENoYXJzID0gMDtcbiAgY29uc3QgcmVtb3ZlZCA9IG5ldyBTZXQoKTtcbiAgY29uc3QgcGF0aFJ4ID0gL1xcbj9kaWZmIC0tZ2l0ICg/OmF8YilcXC8oXFxTKykgKD86YXxiKVxcLyhcXFMrKS95O1xuXG4gIGxldCBpbmRleCA9IDA7XG4gIHdoaWxlIChpbmRleCAhPT0gLTEpIHtcbiAgICBsZXQgaW5jbHVkZSA9IHRydWU7XG5cbiAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5hbC5pbmRleE9mKCdcXG5kaWZmIC0tZ2l0ICcsIGluZGV4KTtcbiAgICBjb25zdCBuZXh0SW5kZXggPSByZXN1bHQgIT09IC0xID8gcmVzdWx0ICsgMSA6IC0xO1xuICAgIGNvbnN0IHBhdGNoRW5kID0gbmV4dEluZGV4ICE9PSAtMSA/IG5leHRJbmRleCA6IG9yaWdpbmFsLmxlbmd0aDtcblxuICAgIC8vIEV4Y2x1ZGUgdGhpcyBwYXRjaCBpZiBpdHMgaW5jbHVzaW9uIHdvdWxkIGNhdXNlIHRoZSBwYXRjaCB0byBiZWNvbWUgdG9vIGxhcmdlLlxuICAgIGNvbnN0IHBhdGNoQ2hhcnMgPSBwYXRjaEVuZCAtIGluZGV4ICsgMTtcbiAgICBpZiAoaW5jbHVkZWRDaGFycyArIHBhdGNoQ2hhcnMgPiBNQVhfUEFUQ0hfQ0hBUlMpIHtcbiAgICAgIGluY2x1ZGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaW5jbHVkZSkge1xuICAgICAgLy8gQXZvaWQgY29weWluZyBsYXJnZSBidWZmZXJzIG9mIHRleHQgYXJvdW5kIGlmIHdlJ3JlIGluY2x1ZGluZyBldmVyeXRoaW5nIGFueXdheS5cbiAgICAgIGlmIChhY2N1bXVsYXRpbmcpIHtcbiAgICAgICAgYWNjdW11bGF0ZWQgKz0gb3JpZ2luYWwuc2xpY2UoaW5kZXgsIHBhdGNoRW5kKTtcbiAgICAgIH1cbiAgICAgIGluY2x1ZGVkQ2hhcnMgKz0gcGF0Y2hDaGFycztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZXhjbHVkZWQgcGF0Y2gsIHN0YXJ0IGJ5IGNvcHlpbmcgZXZlcnl0aGluZyBiZWZvcmUgdGhpcyBpbnRvIFwiYWNjdW11bGF0ZWQuXCJcbiAgICAgIGlmICghYWNjdW11bGF0aW5nKSB7XG4gICAgICAgIGFjY3VtdWxhdGluZyA9IHRydWU7XG4gICAgICAgIGFjY3VtdWxhdGVkID0gb3JpZ2luYWwuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgfVxuXG4gICAgICAvLyBFeHRyYWN0IHRoZSByZW1vdmVkIGZpbGVuYW1lcyBmcm9tIHRoZSBcImRpZmYgLS1naXRcIiBsaW5lLlxuICAgICAgcGF0aFJ4Lmxhc3RJbmRleCA9IGluZGV4O1xuICAgICAgY29uc3QgcGF0aE1hdGNoID0gcGF0aFJ4LmV4ZWMob3JpZ2luYWwpO1xuICAgICAgaWYgKHBhdGhNYXRjaCkge1xuICAgICAgICByZW1vdmVkLmFkZChwYXRoTWF0Y2hbMV0pO1xuICAgICAgICByZW1vdmVkLmFkZChwYXRoTWF0Y2hbMl0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICB9XG5cbiAgcmV0dXJuIHtmaWx0ZXJlZDogYWNjdW11bGF0aW5nID8gYWNjdW11bGF0ZWQgOiBvcmlnaW5hbCwgcmVtb3ZlZH07XG59XG4iXX0=