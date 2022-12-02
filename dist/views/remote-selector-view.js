"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RemoteSelectorView extends _react.default.Component {
  render() {
    const {
      remotes,
      currentBranch,
      selectRemote
    } = this.props; // todo: ask Ash how to test this before merging.

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZW1vdGUtc2VsZWN0b3Itdmlldy5qcyJdLCJuYW1lcyI6WyJSZW1vdGVTZWxlY3RvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlbW90ZXMiLCJjdXJyZW50QnJhbmNoIiwic2VsZWN0UmVtb3RlIiwicHJvcHMiLCJnZXROYW1lIiwiQXJyYXkiLCJmcm9tIiwicmVtb3RlIiwiZSIsImdldE93bmVyIiwiZ2V0UmVwbyIsIlJlbW90ZVNldFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIkJyYW5jaFByb3BUeXBlIiwiUHJvcFR5cGVzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFPOURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU07QUFBQ0MsTUFBQUEsT0FBRDtBQUFVQyxNQUFBQSxhQUFWO0FBQXlCQyxNQUFBQTtBQUF6QixRQUF5QyxLQUFLQyxLQUFwRCxDQURPLENBRVA7O0FBQ0EsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsTUFERixFQUVFLDJEQUZGLEVBR0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0UsbUtBRVMsNkNBQVNGLGFBQWEsQ0FBQ0csT0FBZCxFQUFULENBRlQsYUFERixDQUhGLEVBU0UseUNBQ0dDLEtBQUssQ0FBQ0MsSUFBTixDQUFXTixPQUFYLEVBQW9CTyxNQUFNLElBQ3pCO0FBQUksTUFBQSxHQUFHLEVBQUVBLE1BQU0sQ0FBQ0gsT0FBUDtBQUFULE9BQ0U7QUFBUSxNQUFBLFNBQVMsRUFBQyxpQkFBbEI7QUFBb0MsTUFBQSxPQUFPLEVBQUVJLENBQUMsSUFBSU4sWUFBWSxDQUFDTSxDQUFELEVBQUlELE1BQUo7QUFBOUQsT0FDR0EsTUFBTSxDQUFDSCxPQUFQLEVBREgsUUFDdUJHLE1BQU0sQ0FBQ0UsUUFBUCxFQUR2QixPQUMyQ0YsTUFBTSxDQUFDRyxPQUFQLEVBRDNDLE1BREYsQ0FERCxDQURILENBVEYsQ0FERjtBQXFCRDs7QUEvQjZEOzs7O2dCQUEzQ2Qsa0IsZUFDQTtBQUNqQkksRUFBQUEsT0FBTyxFQUFFVyw4QkFBa0JDLFVBRFY7QUFFakJYLEVBQUFBLGFBQWEsRUFBRVksMkJBQWVELFVBRmI7QUFHakJWLEVBQUFBLFlBQVksRUFBRVksbUJBQVVDLElBQVYsQ0FBZUg7QUFIWixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCB7UmVtb3RlU2V0UHJvcFR5cGUsIEJyYW5jaFByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlU2VsZWN0b3JWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZW1vdGVzOiBSZW1vdGVTZXRQcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIGN1cnJlbnRCcmFuY2g6IEJyYW5jaFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc2VsZWN0UmVtb3RlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtyZW1vdGVzLCBjdXJyZW50QnJhbmNoLCBzZWxlY3RSZW1vdGV9ID0gdGhpcy5wcm9wcztcbiAgICAvLyB0b2RvOiBhc2sgQXNoIGhvdyB0byB0ZXN0IHRoaXMgYmVmb3JlIG1lcmdpbmcuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJlbW90ZVNlbGVjdG9yXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUdpdEh1Yi1MYXJnZUljb24gaWNvbiBpY29uLW1pcnJvclwiIC8+XG4gICAgICAgIDxoMT5TZWxlY3QgYSBSZW1vdGU8L2gxPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImluaXRpYWxpemUtcmVwby1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIDxzcGFuPlRoaXMgcmVwb3NpdG9yeSBoYXMgbXVsdGlwbGUgcmVtb3RlcyBob3N0ZWQgYXQgR2l0SHViLmNvbS5cbiAgICAgICAgICBTZWxlY3QgYSByZW1vdGUgdG8gc2VlIHB1bGwgcmVxdWVzdHMgYXNzb2NpYXRlZFxuICAgICAgICAgIHdpdGggdGhlIDxzdHJvbmc+e2N1cnJlbnRCcmFuY2guZ2V0TmFtZSgpfTwvc3Ryb25nPiBicmFuY2g6PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8dWw+XG4gICAgICAgICAge0FycmF5LmZyb20ocmVtb3RlcywgcmVtb3RlID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e3JlbW90ZS5nZXROYW1lKCl9PlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e2UgPT4gc2VsZWN0UmVtb3RlKGUsIHJlbW90ZSl9PlxuICAgICAgICAgICAgICAgIHtyZW1vdGUuZ2V0TmFtZSgpfSAoe3JlbW90ZS5nZXRPd25lcigpfS97cmVtb3RlLmdldFJlcG8oKX0pXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==