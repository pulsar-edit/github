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
    return /*#__PURE__*/_react.default.createElement("button", {
      className: "github-StatusBarTile inline-block",
      onClick: this.handleClick
    }, /*#__PURE__*/_react.default.createElement(_octicon.default, {
      icon: "mark-github"
    }), "GitHub");
  }

}

exports.default = GithubTileView;

_defineProperty(GithubTileView, "propTypes", {
  didClick: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9naXRodWItdGlsZS12aWV3LmpzIl0sIm5hbWVzIjpbIkdpdGh1YlRpbGVWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiaGFuZGxlQ2xpY2siLCJwYWNrYWdlIiwiY29tcG9uZW50IiwiZGlkQ2xpY2siLCJyZW5kZXIiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxjQUFOLFNBQTZCQyxlQUFNQyxTQUFuQyxDQUE2QztBQUsxREMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjtBQUNBLDJCQUFTLElBQVQsRUFBZSxhQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLFdBQVcsR0FBRztBQUNaLGlDQUFTLE9BQVQsRUFBa0I7QUFBQ0MsTUFBQUEsT0FBTyxFQUFFLFFBQVY7QUFBb0JDLE1BQUFBLFNBQVMsRUFBRTtBQUEvQixLQUFsQjtBQUNBLFNBQUtILEtBQUwsQ0FBV0ksUUFBWDtBQUNEOztBQUVEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCx3QkFDRTtBQUNFLE1BQUEsU0FBUyxFQUFDLG1DQURaO0FBRUUsTUFBQSxPQUFPLEVBQUUsS0FBS0o7QUFGaEIsb0JBR0UsNkJBQUMsZ0JBQUQ7QUFBUyxNQUFBLElBQUksRUFBQztBQUFkLE1BSEYsV0FERjtBQVFEOztBQXhCeUQ7Ozs7Z0JBQXZDTCxjLGVBQ0E7QUFDakJRLEVBQUFBLFFBQVEsRUFBRUUsbUJBQVVDLElBQVYsQ0FBZUM7QUFEUixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViVGlsZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRpZENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUNsaWNrJyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogJ0dpdGh1YlRpbGVWaWV3J30pO1xuICAgIHRoaXMucHJvcHMuZGlkQ2xpY2soKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZSBpbmxpbmUtYmxvY2tcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPE9jdGljb24gaWNvbj1cIm1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgR2l0SHViXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iXX0=