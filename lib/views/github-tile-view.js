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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9wcm9wVHlwZXMiLCJfb2N0aWNvbiIsIl9yZXBvcnRlclByb3h5IiwiX2hlbHBlcnMiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInQiLCJpIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiciIsImUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsImNhbGwiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJHaXRodWJUaWxlVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImF1dG9iaW5kIiwiaGFuZGxlQ2xpY2siLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJkaWRDbGljayIsInJlbmRlciIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJvbkNsaWNrIiwiaWNvbiIsImV4cG9ydHMiLCJQcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCJdLCJzb3VyY2VzIjpbImdpdGh1Yi10aWxlLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuXG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5pbXBvcnQge2F1dG9iaW5kfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0aHViVGlsZVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRpZENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b2JpbmQodGhpcywgJ2hhbmRsZUNsaWNrJyk7XG4gIH1cblxuICBoYW5kbGVDbGljaygpIHtcbiAgICBhZGRFdmVudCgnY2xpY2snLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogJ0dpdGh1YlRpbGVWaWV3J30pO1xuICAgIHRoaXMucHJvcHMuZGlkQ2xpY2soKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItU3RhdHVzQmFyVGlsZSBpbmxpbmUtYmxvY2tcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPE9jdGljb24gaWNvbj1cIm1hcmstZ2l0aHViXCIgLz5cbiAgICAgICAgR2l0SHViXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFVBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFFBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTtBQUVBLElBQUFHLGNBQUEsR0FBQUgsT0FBQTtBQUNBLElBQUFJLFFBQUEsR0FBQUosT0FBQTtBQUFvQyxTQUFBRCx1QkFBQU0sR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLEtBQUFFLE9BQUEsRUFBQUYsR0FBQTtBQUFBLFNBQUFHLGdCQUFBSCxHQUFBLEVBQUFJLEdBQUEsRUFBQUMsS0FBQSxJQUFBRCxHQUFBLEdBQUFFLGNBQUEsQ0FBQUYsR0FBQSxPQUFBQSxHQUFBLElBQUFKLEdBQUEsSUFBQU8sTUFBQSxDQUFBQyxjQUFBLENBQUFSLEdBQUEsRUFBQUksR0FBQSxJQUFBQyxLQUFBLEVBQUFBLEtBQUEsRUFBQUksVUFBQSxRQUFBQyxZQUFBLFFBQUFDLFFBQUEsb0JBQUFYLEdBQUEsQ0FBQUksR0FBQSxJQUFBQyxLQUFBLFdBQUFMLEdBQUE7QUFBQSxTQUFBTSxlQUFBTSxDQUFBLFFBQUFDLENBQUEsR0FBQUMsWUFBQSxDQUFBRixDQUFBLHVDQUFBQyxDQUFBLEdBQUFBLENBQUEsR0FBQUUsTUFBQSxDQUFBRixDQUFBO0FBQUEsU0FBQUMsYUFBQUYsQ0FBQSxFQUFBSSxDQUFBLDJCQUFBSixDQUFBLEtBQUFBLENBQUEsU0FBQUEsQ0FBQSxNQUFBSyxDQUFBLEdBQUFMLENBQUEsQ0FBQU0sTUFBQSxDQUFBQyxXQUFBLGtCQUFBRixDQUFBLFFBQUFKLENBQUEsR0FBQUksQ0FBQSxDQUFBRyxJQUFBLENBQUFSLENBQUEsRUFBQUksQ0FBQSx1Q0FBQUgsQ0FBQSxTQUFBQSxDQUFBLFlBQUFRLFNBQUEseUVBQUFMLENBQUEsR0FBQUQsTUFBQSxHQUFBTyxNQUFBLEVBQUFWLENBQUE7QUFFckIsTUFBTVcsY0FBYyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQUsxREMsV0FBV0EsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQ1osSUFBQUMsaUJBQVEsRUFBQyxJQUFJLEVBQUUsYUFBYSxDQUFDO0VBQy9CO0VBRUFDLFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUFDLHVCQUFRLEVBQUMsT0FBTyxFQUFFO01BQUNDLE9BQU8sRUFBRSxRQUFRO01BQUVDLFNBQVMsRUFBRTtJQUFnQixDQUFDLENBQUM7SUFDbkUsSUFBSSxDQUFDTCxLQUFLLENBQUNNLFFBQVEsQ0FBQyxDQUFDO0VBQ3ZCO0VBRUFDLE1BQU1BLENBQUEsRUFBRztJQUNQLE9BQ0V6QyxNQUFBLENBQUFTLE9BQUEsQ0FBQWlDLGFBQUE7TUFDRUMsU0FBUyxFQUFDLG1DQUFtQztNQUM3Q0MsT0FBTyxFQUFFLElBQUksQ0FBQ1I7SUFBWSxHQUMxQnBDLE1BQUEsQ0FBQVMsT0FBQSxDQUFBaUMsYUFBQSxDQUFDdEMsUUFBQSxDQUFBSyxPQUFPO01BQUNvQyxJQUFJLEVBQUM7SUFBYSxDQUFFLENBQUMsVUFFeEIsQ0FBQztFQUViO0FBQ0Y7QUFBQ0MsT0FBQSxDQUFBckMsT0FBQSxHQUFBcUIsY0FBQTtBQUFBcEIsZUFBQSxDQXpCb0JvQixjQUFjLGVBQ2Q7RUFDakJVLFFBQVEsRUFBRU8sa0JBQVMsQ0FBQ0MsSUFBSSxDQUFDQztBQUMzQixDQUFDIn0=