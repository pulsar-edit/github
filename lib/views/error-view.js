"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class ErrorView extends _react.default.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "renderDescription", (description, key) => {
      if (this.props.preformatted) {
        return _react.default.createElement("pre", {
          key: key,
          className: "github-Message-description"
        }, description);
      } else {
        return _react.default.createElement("p", {
          key: key,
          className: "github-Message-description"
        }, description);
      }
    });
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-Message"
    }, _react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, _react.default.createElement("h1", {
      className: "github-Message-title"
    }, this.props.title), this.props.descriptions.map(this.renderDescription), _react.default.createElement("div", {
      className: "github-Message-action"
    }, this.props.retry && _react.default.createElement("button", {
      className: "github-Message-button btn btn-primary",
      onClick: this.props.retry
    }, "Try Again"), this.props.logout && _react.default.createElement("button", {
      className: "github-Message-button btn btn-logout",
      onClick: this.props.logout
    }, "Logout"))));
  }
}
exports.default = ErrorView;
_defineProperty(ErrorView, "propTypes", {
  title: _propTypes.default.string,
  descriptions: _propTypes.default.arrayOf(_propTypes.default.string),
  preformatted: _propTypes.default.bool,
  retry: _propTypes.default.func,
  logout: _propTypes.default.func
});
_defineProperty(ErrorView, "defaultProps", {
  title: 'Error',
  descriptions: ['An unknown error occurred'],
  preformatted: false
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFcnJvclZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImRlc2NyaXB0aW9uIiwia2V5IiwicHJvcHMiLCJwcmVmb3JtYXR0ZWQiLCJyZW5kZXIiLCJ0aXRsZSIsImRlc2NyaXB0aW9ucyIsIm1hcCIsInJlbmRlckRlc2NyaXB0aW9uIiwicmV0cnkiLCJsb2dvdXQiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJhcnJheU9mIiwiYm9vbCIsImZ1bmMiXSwic291cmNlcyI6WyJlcnJvci12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgcHJlZm9ybWF0dGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICBkZXNjcmlwdGlvbnM6IFsnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCddLFxuICAgIHByZWZvcm1hdHRlZDogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kZXNjcmlwdGlvbnMubWFwKHRoaXMucmVuZGVyRGVzY3JpcHRpb24pfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZXRyeSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMucmV0cnl9PlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvZ291dCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGtleSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnByZWZvcm1hdHRlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZSBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHAga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3A+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQW1DO0FBQUE7QUFBQTtBQUFBO0FBRXBCLE1BQU1BLFNBQVMsU0FBU0MsY0FBSyxDQUFDQyxTQUFTLENBQUM7RUFBQTtJQUFBO0lBQUEsMkNBbUNqQyxDQUFDQyxXQUFXLEVBQUVDLEdBQUcsS0FBSztNQUN4QyxJQUFJLElBQUksQ0FBQ0MsS0FBSyxDQUFDQyxZQUFZLEVBQUU7UUFDM0IsT0FDRTtVQUFLLEdBQUcsRUFBRUYsR0FBSTtVQUFDLFNBQVMsRUFBQztRQUE0QixHQUNsREQsV0FBVyxDQUNSO01BRVYsQ0FBQyxNQUFNO1FBQ0wsT0FDRTtVQUFHLEdBQUcsRUFBRUMsR0FBSTtVQUFDLFNBQVMsRUFBQztRQUE0QixHQUNoREQsV0FBVyxDQUNWO01BRVI7SUFDRixDQUFDO0VBQUE7RUFqQ0RJLE1BQU0sR0FBRztJQUNQLE9BQ0U7TUFBSyxTQUFTLEVBQUM7SUFBZ0IsR0FDN0I7TUFBSyxTQUFTLEVBQUM7SUFBd0IsR0FDckM7TUFBSSxTQUFTLEVBQUM7SUFBc0IsR0FBRSxJQUFJLENBQUNGLEtBQUssQ0FBQ0csS0FBSyxDQUFNLEVBQzNELElBQUksQ0FBQ0gsS0FBSyxDQUFDSSxZQUFZLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUNDLGlCQUFpQixDQUFDLEVBQ3BEO01BQUssU0FBUyxFQUFDO0lBQXVCLEdBQ25DLElBQUksQ0FBQ04sS0FBSyxDQUFDTyxLQUFLLElBQ2Y7TUFBUSxTQUFTLEVBQUMsdUNBQXVDO01BQUMsT0FBTyxFQUFFLElBQUksQ0FBQ1AsS0FBSyxDQUFDTztJQUFNLGVBQ3JGLEVBQ0EsSUFBSSxDQUFDUCxLQUFLLENBQUNRLE1BQU0sSUFDaEI7TUFBUSxTQUFTLEVBQUMsc0NBQXNDO01BQUMsT0FBTyxFQUFFLElBQUksQ0FBQ1IsS0FBSyxDQUFDUTtJQUFPLFlBQ3JGLENBQ0csQ0FDRixDQUNGO0VBRVY7QUFpQkY7QUFBQztBQUFBLGdCQWxEb0JiLFNBQVMsZUFDVDtFQUNqQlEsS0FBSyxFQUFFTSxrQkFBUyxDQUFDQyxNQUFNO0VBQ3ZCTixZQUFZLEVBQUVLLGtCQUFTLENBQUNFLE9BQU8sQ0FBQ0Ysa0JBQVMsQ0FBQ0MsTUFBTSxDQUFDO0VBQ2pEVCxZQUFZLEVBQUVRLGtCQUFTLENBQUNHLElBQUk7RUFFNUJMLEtBQUssRUFBRUUsa0JBQVMsQ0FBQ0ksSUFBSTtFQUNyQkwsTUFBTSxFQUFFQyxrQkFBUyxDQUFDSTtBQUNwQixDQUFDO0FBQUEsZ0JBUmtCbEIsU0FBUyxrQkFVTjtFQUNwQlEsS0FBSyxFQUFFLE9BQU87RUFDZEMsWUFBWSxFQUFFLENBQUMsMkJBQTJCLENBQUM7RUFDM0NILFlBQVksRUFBRTtBQUNoQixDQUFDIn0=