"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _octicon = _interopRequireDefault(require("../atom/octicon"));

var _reporterProxy = require("../reporter-proxy");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GithubTileView extends _react.default.Component {
  constructor(props) {
    super(props);
    (0, _helpers.autobind)(this, 'handleClick');
  }

  handleClick() {
    (0, _reporterProxy.addEvent)('click', {
      package: 'github',
      component: 'GithubTileView'
    });
    this.props.didClick();
  }

  render() {
    return _react.default.createElement("button", {
      className: "github-StatusBarTile inline-block",
      onClick: this.handleClick
    }, _react.default.createElement(_octicon.default, {
      icon: "mark-github"
    }), "GitHub");
  }

}

exports.default = GithubTileView;

_defineProperty(GithubTileView, "propTypes", {
  didClick: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItdGlsZS12aWV3LmpzIl0sIm5hbWVzIjpbIkdpdGh1YlRpbGVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaGFuZGxlQ2xpY2siLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZGlkQ2xpY2siLCJyZW5kZXIiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxjQUFOLFNBQTZCQyxlQUFNQyxTQUFuQyxDQUE2QztBQUsxREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUNBLDJCQUFTLElBQVQsRUFBZSxhQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsR0FBRztBQUNaLGlDQUFTLE9BQVQsRUFBa0I7QUFBQ0MsTUFBQUEsT0FBTyxFQUFFLFFBQVY7QUFBb0JDLE1BQUFBLFNBQVMsRUFBRTtBQUEvQixLQUFsQjtBQUNBLFNBQUtILEtBQUwsQ0FBV0ksUUFBWDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFO0FBQ0UsTUFBQSxTQUFTLEVBQUMsbUNBRFo7QUFFRSxNQUFBLE9BQU8sRUFBRSxLQUFLSjtBQUZoQixPQUdFLDZCQUFDLGdCQUFEO0FBQVMsTUFBQSxJQUFJLEVBQUM7QUFBZCxNQUhGLFdBREY7QUFRRDs7QUF4QnlEOzs7O2dCQUF2Q0wsYyxlQUNBO0FBQ2pCUSxFQUFBQSxRQUFRLEVBQUVFLG1CQUFVQyxJQUFWLENBQWVDO0FBRFIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcblxuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuaW1wb3J0IHthdXRvYmluZH0gZnJvbSAnLi4vaGVscGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGh1YlRpbGVWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBkaWRDbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdoYW5kbGVDbGljaycpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgYWRkRXZlbnQoJ2NsaWNrJywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6ICdHaXRodWJUaWxlVmlldyd9KTtcbiAgICB0aGlzLnByb3BzLmRpZENsaWNrKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVN0YXR1c0JhclRpbGUgaW5saW5lLWJsb2NrXCJcbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgIDxPY3RpY29uIGljb249XCJtYXJrLWdpdGh1YlwiIC8+XG4gICAgICAgIEdpdEh1YlxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIl19