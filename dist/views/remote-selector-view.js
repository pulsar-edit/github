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

    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-RemoteSelector"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-GitHub-LargeIcon icon icon-mirror"
    }), /*#__PURE__*/_react.default.createElement("h1", null, "Select a Remote"), /*#__PURE__*/_react.default.createElement("div", {
      className: "initialize-repo-description"
    }, /*#__PURE__*/_react.default.createElement("span", null, "This repository has multiple remotes hosted at GitHub.com. Select a remote to see pull requests associated with the ", /*#__PURE__*/_react.default.createElement("strong", null, currentBranch.getName()), " branch:")), /*#__PURE__*/_react.default.createElement("ul", null, Array.from(remotes, remote => /*#__PURE__*/_react.default.createElement("li", {
      key: remote.getName()
    }, /*#__PURE__*/_react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZW1vdGUtc2VsZWN0b3Itdmlldy5qcyJdLCJuYW1lcyI6WyJSZW1vdGVTZWxlY3RvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsInJlbmRlciIsInJlbW90ZXMiLCJjdXJyZW50QnJhbmNoIiwic2VsZWN0UmVtb3RlIiwicHJvcHMiLCJnZXROYW1lIiwiQXJyYXkiLCJmcm9tIiwicmVtb3RlIiwiZSIsImdldE93bmVyIiwiZ2V0UmVwbyIsIlJlbW90ZVNldFByb3BUeXBlIiwiaXNSZXF1aXJlZCIsIkJyYW5jaFByb3BUeXBlIiwiUHJvcFR5cGVzIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTixTQUFpQ0MsZUFBTUMsU0FBdkMsQ0FBaUQ7QUFPOURDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU07QUFBQ0MsTUFBQUEsT0FBRDtBQUFVQyxNQUFBQSxhQUFWO0FBQXlCQyxNQUFBQTtBQUF6QixRQUF5QyxLQUFLQyxLQUFwRCxDQURPLENBRVA7O0FBQ0Esd0JBQ0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLG9CQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixNQURGLGVBRUUsMkRBRkYsZUFHRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0UsZ0xBRVMsNkNBQVNGLGFBQWEsQ0FBQ0csT0FBZCxFQUFULENBRlQsYUFERixDQUhGLGVBU0UseUNBQ0dDLEtBQUssQ0FBQ0MsSUFBTixDQUFXTixPQUFYLEVBQW9CTyxNQUFNLGlCQUN6QjtBQUFJLE1BQUEsR0FBRyxFQUFFQSxNQUFNLENBQUNILE9BQVA7QUFBVCxvQkFDRTtBQUFRLE1BQUEsU0FBUyxFQUFDLGlCQUFsQjtBQUFvQyxNQUFBLE9BQU8sRUFBRUksQ0FBQyxJQUFJTixZQUFZLENBQUNNLENBQUQsRUFBSUQsTUFBSjtBQUE5RCxPQUNHQSxNQUFNLENBQUNILE9BQVAsRUFESCxRQUN1QkcsTUFBTSxDQUFDRSxRQUFQLEVBRHZCLE9BQzJDRixNQUFNLENBQUNHLE9BQVAsRUFEM0MsTUFERixDQURELENBREgsQ0FURixDQURGO0FBcUJEOztBQS9CNkQ7Ozs7Z0JBQTNDZCxrQixlQUNBO0FBQ2pCSSxFQUFBQSxPQUFPLEVBQUVXLDhCQUFrQkMsVUFEVjtBQUVqQlgsRUFBQUEsYUFBYSxFQUFFWSwyQkFBZUQsVUFGYjtBQUdqQlYsRUFBQUEsWUFBWSxFQUFFWSxtQkFBVUMsSUFBVixDQUFlSDtBQUhaLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHtSZW1vdGVTZXRQcm9wVHlwZSwgQnJhbmNoUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGVTZWxlY3RvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlbW90ZXM6IFJlbW90ZVNldFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgY3VycmVudEJyYW5jaDogQnJhbmNoUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzZWxlY3RSZW1vdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3JlbW90ZXMsIGN1cnJlbnRCcmFuY2gsIHNlbGVjdFJlbW90ZX0gPSB0aGlzLnByb3BzO1xuICAgIC8vIHRvZG86IGFzayBBc2ggaG93IHRvIHRlc3QgdGhpcyBiZWZvcmUgbWVyZ2luZy5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmVtb3RlU2VsZWN0b3JcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItR2l0SHViLUxhcmdlSWNvbiBpY29uIGljb24tbWlycm9yXCIgLz5cbiAgICAgICAgPGgxPlNlbGVjdCBhIFJlbW90ZTwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5pdGlhbGl6ZS1yZXBvLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgPHNwYW4+VGhpcyByZXBvc2l0b3J5IGhhcyBtdWx0aXBsZSByZW1vdGVzIGhvc3RlZCBhdCBHaXRIdWIuY29tLlxuICAgICAgICAgIFNlbGVjdCBhIHJlbW90ZSB0byBzZWUgcHVsbCByZXF1ZXN0cyBhc3NvY2lhdGVkXG4gICAgICAgICAgd2l0aCB0aGUgPHN0cm9uZz57Y3VycmVudEJyYW5jaC5nZXROYW1lKCl9PC9zdHJvbmc+IGJyYW5jaDo8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDx1bD5cbiAgICAgICAgICB7QXJyYXkuZnJvbShyZW1vdGVzLCByZW1vdGUgPT4gKFxuICAgICAgICAgICAgPGxpIGtleT17cmVtb3RlLmdldE5hbWUoKX0+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgb25DbGljaz17ZSA9PiBzZWxlY3RSZW1vdGUoZSwgcmVtb3RlKX0+XG4gICAgICAgICAgICAgICAge3JlbW90ZS5nZXROYW1lKCl9ICh7cmVtb3RlLmdldE93bmVyKCl9L3tyZW1vdGUuZ2V0UmVwbygpfSlcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19