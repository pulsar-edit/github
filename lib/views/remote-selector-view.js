"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class RemoteSelectorView extends _react.default.Component {
  render() {
    const {
      remotes,
      currentBranch,
      selectRemote
    } = this.props;
    // todo: ask Ash how to test this before merging.
    return _react.default.createElement("div", {
      className: "github-RemoteSelector"
    }, _react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mirror"
    }), _react.default.createElement("h1", null, "Select a Remote"), _react.default.createElement("div", {
      className: "initialize-repo-description"
    }, _react.default.createElement("span", null, "This repository has multiple remotes hosted at GitHub.com. Select a remote to see pull requests associated with the ", _react.default.createElement("strong", null, currentBranch.getName()), " branch:")), _react.default.createElement("ul", null, Array.from(remotes, remote => _react.default.createElement("li", {
      key: remote.getName()
    }, _react.default.createElement("button", {
      className: "btn btn-primary",
      onClick: e => selectRemote(e, remote)
    }, remote.getName(), " (", remote.getOwner(), "/", remote.getRepo(), ")")))));
  }
}
exports.default = RemoteSelectorView;
_defineProperty(RemoteSelectorView, "propTypes", {
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  currentBranch: _propTypes2.BranchPropType.isRequired,
  selectRemote: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZW1vdGVTZWxlY3RvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlbW90ZXMiLCJjdXJyZW50QnJhbmNoIiwic2VsZWN0UmVtb3RlIiwicHJvcHMiLCJnZXROYW1lIiwiQXJyYXkiLCJmcm9tIiwicmVtb3RlIiwiZSIsImdldE93bmVyIiwiZ2V0UmVwbyIsIlJlbW90ZVNldFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIkJyYW5jaFByb3BUeXBlIiwiUHJvcFR5cGVzIiwiZnVuYyJdLCJzb3VyY2VzIjpbInJlbW90ZS1zZWxlY3Rvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge1JlbW90ZVNldFByb3BUeXBlLCBCcmFuY2hQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZVNlbGVjdG9yVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgcmVtb3RlczogUmVtb3RlU2V0UHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBjdXJyZW50QnJhbmNoOiBCcmFuY2hQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHNlbGVjdFJlbW90ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7cmVtb3RlcywgY3VycmVudEJyYW5jaCwgc2VsZWN0UmVtb3RlfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gdG9kbzogYXNrIEFzaCBob3cgdG8gdGVzdCB0aGlzIGJlZm9yZSBtZXJnaW5nLlxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZW1vdGVTZWxlY3RvclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1HaXRIdWItTGFyZ2VJY29uIGljb24gaWNvbi1taXJyb3JcIiAvPlxuICAgICAgICA8aDE+U2VsZWN0IGEgUmVtb3RlPC9oMT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbml0aWFsaXplLXJlcG8tZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICA8c3Bhbj5UaGlzIHJlcG9zaXRvcnkgaGFzIG11bHRpcGxlIHJlbW90ZXMgaG9zdGVkIGF0IEdpdEh1Yi5jb20uXG4gICAgICAgICAgU2VsZWN0IGEgcmVtb3RlIHRvIHNlZSBwdWxsIHJlcXVlc3RzIGFzc29jaWF0ZWRcbiAgICAgICAgICB3aXRoIHRoZSA8c3Ryb25nPntjdXJyZW50QnJhbmNoLmdldE5hbWUoKX08L3N0cm9uZz4gYnJhbmNoOjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHVsPlxuICAgICAgICAgIHtBcnJheS5mcm9tKHJlbW90ZXMsIHJlbW90ZSA9PiAoXG4gICAgICAgICAgICA8bGkga2V5PXtyZW1vdGUuZ2V0TmFtZSgpfT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXtlID0+IHNlbGVjdFJlbW90ZShlLCByZW1vdGUpfT5cbiAgICAgICAgICAgICAgICB7cmVtb3RlLmdldE5hbWUoKX0gKHtyZW1vdGUuZ2V0T3duZXIoKX0ve3JlbW90ZS5nZXRSZXBvKCl9KVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUFnRTtBQUFBO0FBQUE7QUFBQTtBQUVqRCxNQUFNQSxrQkFBa0IsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFPOURDLE1BQU0sR0FBRztJQUNQLE1BQU07TUFBQ0MsT0FBTztNQUFFQyxhQUFhO01BQUVDO0lBQVksQ0FBQyxHQUFHLElBQUksQ0FBQ0MsS0FBSztJQUN6RDtJQUNBLE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBdUIsR0FDcEM7TUFBSyxTQUFTLEVBQUM7SUFBMEMsRUFBRyxFQUM1RCwyREFBd0IsRUFDeEI7TUFBSyxTQUFTLEVBQUM7SUFBNkIsR0FDMUMsbUtBRVMsNkNBQVNGLGFBQWEsQ0FBQ0csT0FBTyxFQUFFLENBQVUsYUFBZSxDQUM5RCxFQUVOLHlDQUNHQyxLQUFLLENBQUNDLElBQUksQ0FBQ04sT0FBTyxFQUFFTyxNQUFNLElBQ3pCO01BQUksR0FBRyxFQUFFQSxNQUFNLENBQUNILE9BQU87SUFBRyxHQUN4QjtNQUFRLFNBQVMsRUFBQyxpQkFBaUI7TUFBQyxPQUFPLEVBQUVJLENBQUMsSUFBSU4sWUFBWSxDQUFDTSxDQUFDLEVBQUVELE1BQU07SUFBRSxHQUN2RUEsTUFBTSxDQUFDSCxPQUFPLEVBQUUsUUFBSUcsTUFBTSxDQUFDRSxRQUFRLEVBQUUsT0FBR0YsTUFBTSxDQUFDRyxPQUFPLEVBQUUsTUFDbEQsQ0FFWixDQUFDLENBQ0MsQ0FDRDtFQUVWO0FBQ0Y7QUFBQztBQUFBLGdCQWhDb0JkLGtCQUFrQixlQUNsQjtFQUNqQkksT0FBTyxFQUFFVyw2QkFBaUIsQ0FBQ0MsVUFBVTtFQUNyQ1gsYUFBYSxFQUFFWSwwQkFBYyxDQUFDRCxVQUFVO0VBQ3hDVixZQUFZLEVBQUVZLGtCQUFTLENBQUNDLElBQUksQ0FBQ0g7QUFDL0IsQ0FBQyJ9