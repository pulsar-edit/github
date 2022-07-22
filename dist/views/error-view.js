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
        return /*#__PURE__*/_react.default.createElement("pre", {
          key: key,
          className: "github-Message-description"
        }, description);
      } else {
        return /*#__PURE__*/_react.default.createElement("p", {
          key: key,
          className: "github-Message-description"
        }, description);
      }
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Message"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Message-wrapper"
    }, /*#__PURE__*/_react.default.createElement("h1", {
      className: "github-Message-title"
    }, this.props.title), this.props.descriptions.map(this.renderDescription), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Message-action"
    }, this.props.retry && /*#__PURE__*/_react.default.createElement("button", {
      className: "github-Message-button btn btn-primary",
      onClick: this.props.retry
    }, "Try Again"), this.props.logout && /*#__PURE__*/_react.default.createElement("button", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9lcnJvci12aWV3LmpzIl0sIm5hbWVzIjpbIkVycm9yVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiZGVzY3JpcHRpb24iLCJrZXkiLCJwcm9wcyIsInByZWZvcm1hdHRlZCIsInJlbmRlciIsInRpdGxlIiwiZGVzY3JpcHRpb25zIiwibWFwIiwicmVuZGVyRGVzY3JpcHRpb24iLCJyZXRyeSIsImxvZ291dCIsIlByb3BUeXBlcyIsInN0cmluZyIsImFycmF5T2YiLCJib29sIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxTQUFOLFNBQXdCQyxlQUFNQyxTQUE5QixDQUF3QztBQUFBO0FBQUE7O0FBQUEsK0NBbUNqQyxDQUFDQyxXQUFELEVBQWNDLEdBQWQsS0FBc0I7QUFDeEMsVUFBSSxLQUFLQyxLQUFMLENBQVdDLFlBQWYsRUFBNkI7QUFDM0IsNEJBQ0U7QUFBSyxVQUFBLEdBQUcsRUFBRUYsR0FBVjtBQUFlLFVBQUEsU0FBUyxFQUFDO0FBQXpCLFdBQ0dELFdBREgsQ0FERjtBQUtELE9BTkQsTUFNTztBQUNMLDRCQUNFO0FBQUcsVUFBQSxHQUFHLEVBQUVDLEdBQVI7QUFBYSxVQUFBLFNBQVMsRUFBQztBQUF2QixXQUNHRCxXQURILENBREY7QUFLRDtBQUNGLEtBakRvRDtBQUFBOztBQWdCckRJLEVBQUFBLE1BQU0sR0FBRztBQUNQLHdCQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixvQkFDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsb0JBQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQXNDLEtBQUtGLEtBQUwsQ0FBV0csS0FBakQsQ0FERixFQUVHLEtBQUtILEtBQUwsQ0FBV0ksWUFBWCxDQUF3QkMsR0FBeEIsQ0FBNEIsS0FBS0MsaUJBQWpDLENBRkgsZUFHRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRyxLQUFLTixLQUFMLENBQVdPLEtBQVgsaUJBQ0M7QUFBUSxNQUFBLFNBQVMsRUFBQyx1Q0FBbEI7QUFBMEQsTUFBQSxPQUFPLEVBQUUsS0FBS1AsS0FBTCxDQUFXTztBQUE5RSxtQkFGSixFQUlHLEtBQUtQLEtBQUwsQ0FBV1EsTUFBWCxpQkFDQztBQUFRLE1BQUEsU0FBUyxFQUFDLHNDQUFsQjtBQUF5RCxNQUFBLE9BQU8sRUFBRSxLQUFLUixLQUFMLENBQVdRO0FBQTdFLGdCQUxKLENBSEYsQ0FERixDQURGO0FBZ0JEOztBQWpDb0Q7Ozs7Z0JBQWxDYixTLGVBQ0E7QUFDakJRLEVBQUFBLEtBQUssRUFBRU0sbUJBQVVDLE1BREE7QUFFakJOLEVBQUFBLFlBQVksRUFBRUssbUJBQVVFLE9BQVYsQ0FBa0JGLG1CQUFVQyxNQUE1QixDQUZHO0FBR2pCVCxFQUFBQSxZQUFZLEVBQUVRLG1CQUFVRyxJQUhQO0FBS2pCTCxFQUFBQSxLQUFLLEVBQUVFLG1CQUFVSSxJQUxBO0FBTWpCTCxFQUFBQSxNQUFNLEVBQUVDLG1CQUFVSTtBQU5ELEM7O2dCQURBbEIsUyxrQkFVRztBQUNwQlEsRUFBQUEsS0FBSyxFQUFFLE9BRGE7QUFFcEJDLEVBQUFBLFlBQVksRUFBRSxDQUFDLDJCQUFELENBRk07QUFHcEJILEVBQUFBLFlBQVksRUFBRTtBQUhNLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkZXNjcmlwdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIHByZWZvcm1hdHRlZDogUHJvcFR5cGVzLmJvb2wsXG5cbiAgICByZXRyeTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgbG9nb3V0OiBQcm9wVHlwZXMuZnVuYyxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdGl0bGU6ICdFcnJvcicsXG4gICAgZGVzY3JpcHRpb25zOiBbJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnXSxcbiAgICBwcmVmb3JtYXR0ZWQ6IGZhbHNlLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLU1lc3NhZ2Utd3JhcHBlclwiPlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS10aXRsZVwiPnt0aGlzLnByb3BzLnRpdGxlfTwvaDE+XG4gICAgICAgICAge3RoaXMucHJvcHMuZGVzY3JpcHRpb25zLm1hcCh0aGlzLnJlbmRlckRlc2NyaXB0aW9uKX1cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWFjdGlvblwiPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucmV0cnkgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWJ1dHRvbiBidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnByb3BzLnJldHJ5fT5UcnkgQWdhaW48L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5sb2dvdXQgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWJ1dHRvbiBidG4gYnRuLWxvZ291dFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMubG9nb3V0fT5Mb2dvdXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckRlc2NyaXB0aW9uID0gKGRlc2NyaXB0aW9uLCBrZXkpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5wcmVmb3JtYXR0ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxwcmUga2V5PXtrZXl9IGNsYXNzTmFtZT1cImdpdGh1Yi1NZXNzYWdlLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICA8L3ByZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxwIGtleT17a2V5fSBjbGFzc05hbWU9XCJnaXRodWItTWVzc2FnZS1kZXNjcmlwdGlvblwiPlxuICAgICAgICAgIHtkZXNjcmlwdGlvbn1cbiAgICAgICAgPC9wPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==