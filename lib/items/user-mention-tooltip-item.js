"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _reactRelay = require("react-relay");
var _userMentionTooltipContainer = _interopRequireDefault(require("../containers/user-mention-tooltip-container"));
var _graphql;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class UserMentionTooltipItem {
  constructor(username, relayEnvironment) {
    this.username = username.substr(1);
    this.relayEnvironment = relayEnvironment;
  }
  getElement() {
    return this.element;
  }
  get element() {
    if (!this._element) {
      this._element = document.createElement('div');
      const rootContainer = _react.default.createElement(_reactRelay.QueryRenderer, {
        environment: this.relayEnvironment,
        query: _graphql || (_graphql = function () {
          const node = require("./__generated__/userMentionTooltipItemQuery.graphql");
          if (node.hash && node.hash !== "c0e8b6f6d3028f3f2679ce9e1486981e") {
            console.error("The definition of 'userMentionTooltipItemQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
          }
          return require("./__generated__/userMentionTooltipItemQuery.graphql");
        }),
        variables: {
          username: this.username
        },
        render: ({
          error,
          props,
          retry
        }) => {
          if (error) {
            return _react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return _react.default.createElement(_userMentionTooltipContainer.default, props);
          } else {
            return _react.default.createElement("div", {
              className: "github-Loader"
            }, _react.default.createElement("span", {
              className: "github-Spinner"
            }));
          }
        }
      });
      this._component = _reactDom.default.render(rootContainer, this._element);
    }
    return this._element;
  }
  destroy() {
    if (this._element) {
      _reactDom.default.unmountComponentAtNode(this._element);
      delete this._element;
    }
  }
}
exports.default = UserMentionTooltipItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcmVhY3QiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdERvbSIsIl9yZWFjdFJlbGF5IiwiX3VzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lciIsIl9ncmFwaHFsIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiVXNlck1lbnRpb25Ub29sdGlwSXRlbSIsImNvbnN0cnVjdG9yIiwidXNlcm5hbWUiLCJyZWxheUVudmlyb25tZW50Iiwic3Vic3RyIiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJfZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJvb3RDb250YWluZXIiLCJRdWVyeVJlbmRlcmVyIiwiZW52aXJvbm1lbnQiLCJxdWVyeSIsIm5vZGUiLCJoYXNoIiwiY29uc29sZSIsImVycm9yIiwidmFyaWFibGVzIiwicmVuZGVyIiwicHJvcHMiLCJyZXRyeSIsImNsYXNzTmFtZSIsIl9jb21wb25lbnQiLCJSZWFjdERvbSIsImRlc3Ryb3kiLCJ1bm1vdW50Q29tcG9uZW50QXROb2RlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbInVzZXItbWVudGlvbi10b29sdGlwLWl0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERvbSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHtRdWVyeVJlbmRlcmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBVc2VyTWVudGlvblRvb2x0aXBDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy91c2VyLW1lbnRpb24tdG9vbHRpcC1jb250YWluZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyTWVudGlvblRvb2x0aXBJdGVtIHtcbiAgY29uc3RydWN0b3IodXNlcm5hbWUsIHJlbGF5RW52aXJvbm1lbnQpIHtcbiAgICB0aGlzLnVzZXJuYW1lID0gdXNlcm5hbWUuc3Vic3RyKDEpO1xuICAgIHRoaXMucmVsYXlFbnZpcm9ubWVudCA9IHJlbGF5RW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IHJvb3RDb250YWluZXIgPSAoXG4gICAgICAgIDxRdWVyeVJlbmRlcmVyXG4gICAgICAgICAgZW52aXJvbm1lbnQ9e3RoaXMucmVsYXlFbnZpcm9ubWVudH1cbiAgICAgICAgICBxdWVyeT17Z3JhcGhxbGBcbiAgICAgICAgICAgIHF1ZXJ5IHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeSgkdXNlcm5hbWU6IFN0cmluZyEpIHtcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeU93bmVyKGxvZ2luOiAkdXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICAuLi51c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBgfVxuICAgICAgICAgIHZhcmlhYmxlcz17e1xuICAgICAgICAgICAgdXNlcm5hbWU6IHRoaXMudXNlcm5hbWUsXG4gICAgICAgICAgfX1cbiAgICAgICAgICByZW5kZXI9eyh7ZXJyb3IsIHByb3BzLCByZXRyeX0pID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gPGRpdj5Db3VsZCBub3QgbG9hZCBpbmZvcm1hdGlvbjwvZGl2PjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDxVc2VyTWVudGlvblRvb2x0aXBDb250YWluZXIgey4uLnByb3BzfSAvPjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTG9hZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3Bpbm5lclwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBSZWFjdERvbS5yZW5kZXIocm9vdENvbnRhaW5lciwgdGhpcy5fZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9lbGVtZW50KSB7XG4gICAgICBSZWFjdERvbS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuX2VsZW1lbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX2VsZW1lbnQ7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLE1BQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLFNBQUEsR0FBQUYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFFLFdBQUEsR0FBQUYsT0FBQTtBQUVBLElBQUFHLDRCQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFBdUYsSUFBQUksUUFBQTtBQUFBLFNBQUFMLHVCQUFBTSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRXhFLE1BQU1HLHNCQUFzQixDQUFDO0VBQzFDQyxXQUFXQSxDQUFDQyxRQUFRLEVBQUVDLGdCQUFnQixFQUFFO0lBQ3RDLElBQUksQ0FBQ0QsUUFBUSxHQUFHQSxRQUFRLENBQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEMsSUFBSSxDQUFDRCxnQkFBZ0IsR0FBR0EsZ0JBQWdCO0VBQzFDO0VBRUFFLFVBQVVBLENBQUEsRUFBRztJQUNYLE9BQU8sSUFBSSxDQUFDQyxPQUFPO0VBQ3JCO0VBRUEsSUFBSUEsT0FBT0EsQ0FBQSxFQUFHO0lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQ0MsUUFBUSxFQUFFO01BQ2xCLElBQUksQ0FBQ0EsUUFBUSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDN0MsTUFBTUMsYUFBYSxHQUNqQnBCLE1BQUEsQ0FBQVMsT0FBQSxDQUFBVSxhQUFBLENBQUNmLFdBQUEsQ0FBQWlCLGFBQWE7UUFDWkMsV0FBVyxFQUFFLElBQUksQ0FBQ1QsZ0JBQWlCO1FBQ25DVSxLQUFLLEVBQUFqQixRQUFBLEtBQUFBLFFBQUEsWUFBQUEsQ0FBQTtVQUFBLE1BQUFrQixJQUFBLEdBQUF0QixPQUFBO1VBQUEsSUFBQXNCLElBQUEsQ0FBQUMsSUFBQSxJQUFBRCxJQUFBLENBQUFDLElBQUE7WUFBQUMsT0FBQSxDQUFBQyxLQUFBO1VBQUE7VUFBQSxPQUFBekIsT0FBQTtRQUFBLEVBTUg7UUFDRjBCLFNBQVMsRUFBRTtVQUNUaEIsUUFBUSxFQUFFLElBQUksQ0FBQ0E7UUFDakIsQ0FBRTtRQUNGaUIsTUFBTSxFQUFFQSxDQUFDO1VBQUNGLEtBQUs7VUFBRUcsS0FBSztVQUFFQztRQUFLLENBQUMsS0FBSztVQUNqQyxJQUFJSixLQUFLLEVBQUU7WUFDVCxPQUFPM0IsTUFBQSxDQUFBUyxPQUFBLENBQUFVLGFBQUEsMENBQW9DLENBQUM7VUFDOUMsQ0FBQyxNQUFNLElBQUlXLEtBQUssRUFBRTtZQUNoQixPQUFPOUIsTUFBQSxDQUFBUyxPQUFBLENBQUFVLGFBQUEsQ0FBQ2QsNEJBQUEsQ0FBQUksT0FBMkIsRUFBS3FCLEtBQVEsQ0FBQztVQUNuRCxDQUFDLE1BQU07WUFDTCxPQUNFOUIsTUFBQSxDQUFBUyxPQUFBLENBQUFVLGFBQUE7Y0FBS2EsU0FBUyxFQUFDO1lBQWUsR0FDNUJoQyxNQUFBLENBQUFTLE9BQUEsQ0FBQVUsYUFBQTtjQUFNYSxTQUFTLEVBQUM7WUFBZ0IsQ0FBRSxDQUMvQixDQUFDO1VBRVY7UUFDRjtNQUFFLENBQ0gsQ0FDRjtNQUNELElBQUksQ0FBQ0MsVUFBVSxHQUFHQyxpQkFBUSxDQUFDTCxNQUFNLENBQUNULGFBQWEsRUFBRSxJQUFJLENBQUNILFFBQVEsQ0FBQztJQUNqRTtJQUVBLE9BQU8sSUFBSSxDQUFDQSxRQUFRO0VBQ3RCO0VBRUFrQixPQUFPQSxDQUFBLEVBQUc7SUFDUixJQUFJLElBQUksQ0FBQ2xCLFFBQVEsRUFBRTtNQUNqQmlCLGlCQUFRLENBQUNFLHNCQUFzQixDQUFDLElBQUksQ0FBQ25CLFFBQVEsQ0FBQztNQUM5QyxPQUFPLElBQUksQ0FBQ0EsUUFBUTtJQUN0QjtFQUNGO0FBQ0Y7QUFBQ29CLE9BQUEsQ0FBQTVCLE9BQUEsR0FBQUMsc0JBQUEiLCJpZ25vcmVMaXN0IjpbXX0=