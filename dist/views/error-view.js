"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9lcnJvci12aWV3LmpzIl0sIm5hbWVzIjpbIkVycm9yVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZGVzY3JpcHRpb24iLCJrZXkiLCJwcm9wcyIsInByZWZvcm1hdHRlZCIsInJlbmRlciIsInRpdGxlIiwiZGVzY3JpcHRpb25zIiwibWFwIiwicmVuZGVyRGVzY3JpcHRpb24iLCJyZXRyeSIsImxvZ291dCIsIlByb3BUeXBlcyIsInN0cmluZyIsImFycmF5T2YiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxTQUFOLFNBQXdCQyxlQUFNQyxTQUE5QixDQUF3QztBQUFBO0FBQUE7O0FBQUEsK0NBbUNqQyxDQUFDQyxXQUFELEVBQWNDLEdBQWQsS0FBc0I7QUFDeEMsVUFBSSxLQUFLQyxLQUFMLENBQVdDLFlBQWYsRUFBNkI7QUFDM0IsZUFDRTtBQUFLLFVBQUEsR0FBRyxFQUFFRixHQUFWO0FBQWUsVUFBQSxTQUFTLEVBQUM7QUFBekIsV0FDR0QsV0FESCxDQURGO0FBS0QsT0FORCxNQU1PO0FBQ0wsZUFDRTtBQUFHLFVBQUEsR0FBRyxFQUFFQyxHQUFSO0FBQWEsVUFBQSxTQUFTLEVBQUM7QUFBdkIsV0FDR0QsV0FESCxDQURGO0FBS0Q7QUFDRixLQWpEb0Q7QUFBQTs7QUFnQnJESSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQUksTUFBQSxTQUFTLEVBQUM7QUFBZCxPQUFzQyxLQUFLRixLQUFMLENBQVdHLEtBQWpELENBREYsRUFFRyxLQUFLSCxLQUFMLENBQVdJLFlBQVgsQ0FBd0JDLEdBQXhCLENBQTRCLEtBQUtDLGlCQUFqQyxDQUZILEVBR0U7QUFBSyxNQUFBLFNBQVMsRUFBQztBQUFmLE9BQ0csS0FBS04sS0FBTCxDQUFXTyxLQUFYLElBQ0M7QUFBUSxNQUFBLFNBQVMsRUFBQyx1Q0FBbEI7QUFBMEQsTUFBQSxPQUFPLEVBQUUsS0FBS1AsS0FBTCxDQUFXTztBQUE5RSxtQkFGSixFQUlHLEtBQUtQLEtBQUwsQ0FBV1EsTUFBWCxJQUNDO0FBQVEsTUFBQSxTQUFTLEVBQUMsc0NBQWxCO0FBQXlELE1BQUEsT0FBTyxFQUFFLEtBQUtSLEtBQUwsQ0FBV1E7QUFBN0UsZ0JBTEosQ0FIRixDQURGLENBREY7QUFnQkQ7O0FBakNvRDs7OztnQkFBbENiLFMsZUFDQTtBQUNqQlEsRUFBQUEsS0FBSyxFQUFFTSxtQkFBVUMsTUFEQTtBQUVqQk4sRUFBQUEsWUFBWSxFQUFFSyxtQkFBVUUsT0FBVixDQUFrQkYsbUJBQVVDLE1BQTVCLENBRkc7QUFHakJULEVBQUFBLFlBQVksRUFBRVEsbUJBQVVHLElBSFA7QUFLakJMLEVBQUFBLEtBQUssRUFBRUUsbUJBQVVJLElBTEE7QUFNakJMLEVBQUFBLE1BQU0sRUFBRUMsbUJBQVVJO0FBTkQsQzs7Z0JBREFsQixTLGtCQVVHO0FBQ3BCUSxFQUFBQSxLQUFLLEVBQUUsT0FEYTtBQUVwQkMsRUFBQUEsWUFBWSxFQUFFLENBQUMsMkJBQUQsQ0FGTTtBQUdwQkgsRUFBQUEsWUFBWSxFQUFFO0FBSE0sQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvclZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gICAgcHJlZm9ybWF0dGVkOiBQcm9wVHlwZXMuYm9vbCxcblxuICAgIHJldHJ5OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2dvdXQ6IFByb3BUeXBlcy5mdW5jLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICBkZXNjcmlwdGlvbnM6IFsnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCddLFxuICAgIHByZWZvcm1hdHRlZDogZmFsc2UsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2VcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLXRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5kZXNjcmlwdGlvbnMubWFwKHRoaXMucmVuZGVyRGVzY3JpcHRpb24pfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYWN0aW9uXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5yZXRyeSAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMucmV0cnl9PlRyeSBBZ2FpbjwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmxvZ291dCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtYnV0dG9uIGJ0biBidG4tbG9nb3V0XCIgb25DbGljaz17dGhpcy5wcm9wcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGtleSkgPT4ge1xuICAgIGlmICh0aGlzLnByb3BzLnByZWZvcm1hdHRlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHByZSBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2UtZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICB7ZGVzY3JpcHRpb259XG4gICAgICAgIDwvcHJlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHAga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3A+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIl19