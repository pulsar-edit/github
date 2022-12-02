"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRelay = require("react-relay");

var _issueishTooltipContainer = _interopRequireDefault(require("../containers/issueish-tooltip-container"));

var _graphql;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IssueishTooltipItem {
  constructor(issueishUrl, relayEnvironment) {
    this.issueishUrl = issueishUrl;
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
          const node = require("./__generated__/issueishTooltipItemQuery.graphql");

          if (node.hash && node.hash !== "8e6b32b5cdcdd3debccc7adaa2b4e82c") {
            console.error("The definition of 'issueishTooltipItemQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
          }

          return require("./__generated__/issueishTooltipItemQuery.graphql");
        }),
        variables: {
          issueishUrl: this.issueishUrl
        },
        render: ({
          error,
          props,
          retry
        }) => {
          if (error) {
            return _react.default.createElement("div", null, "Could not load information");
          } else if (props) {
            return _react.default.createElement(_issueishTooltipContainer.default, props);
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

exports.default = IssueishTooltipItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9pdGVtcy9pc3N1ZWlzaC10b29sdGlwLWl0ZW0uanMiXSwibmFtZXMiOlsiSXNzdWVpc2hUb29sdGlwSXRlbSIsImNvbnN0cnVjdG9yIiwiaXNzdWVpc2hVcmwiLCJyZWxheUVudmlyb25tZW50IiwiZ2V0RWxlbWVudCIsImVsZW1lbnQiLCJfZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJvb3RDb250YWluZXIiLCJlcnJvciIsInByb3BzIiwicmV0cnkiLCJfY29tcG9uZW50IiwiUmVhY3REb20iLCJyZW5kZXIiLCJkZXN0cm95IiwidW5tb3VudENvbXBvbmVudEF0Tm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFZSxNQUFNQSxtQkFBTixDQUEwQjtBQUN2Q0MsRUFBQUEsV0FBVyxDQUFDQyxXQUFELEVBQWNDLGdCQUFkLEVBQWdDO0FBQ3pDLFNBQUtELFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsZ0JBQUwsR0FBd0JBLGdCQUF4QjtBQUNEOztBQUVEQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxXQUFPLEtBQUtDLE9BQVo7QUFDRDs7QUFFVSxNQUFQQSxPQUFPLEdBQUc7QUFDWixRQUFJLENBQUMsS0FBS0MsUUFBVixFQUFvQjtBQUNsQixXQUFLQSxRQUFMLEdBQWdCQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7O0FBQ0EsWUFBTUMsYUFBYSxHQUNqQiw2QkFBQyx5QkFBRDtBQUNFLFFBQUEsV0FBVyxFQUFFLEtBQUtOLGdCQURwQjtBQUVFLFFBQUEsS0FBSztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLFVBRlA7QUFTRSxRQUFBLFNBQVMsRUFBRTtBQUNURCxVQUFBQSxXQUFXLEVBQUUsS0FBS0E7QUFEVCxTQVRiO0FBWUUsUUFBQSxNQUFNLEVBQUUsQ0FBQztBQUFDUSxVQUFBQSxLQUFEO0FBQVFDLFVBQUFBLEtBQVI7QUFBZUMsVUFBQUE7QUFBZixTQUFELEtBQTJCO0FBQ2pDLGNBQUlGLEtBQUosRUFBVztBQUNULG1CQUFPLHVFQUFQO0FBQ0QsV0FGRCxNQUVPLElBQUlDLEtBQUosRUFBVztBQUNoQixtQkFBTyw2QkFBQyxpQ0FBRCxFQUE4QkEsS0FBOUIsQ0FBUDtBQUNELFdBRk0sTUFFQTtBQUNMLG1CQUNFO0FBQUssY0FBQSxTQUFTLEVBQUM7QUFBZixlQUNFO0FBQU0sY0FBQSxTQUFTLEVBQUM7QUFBaEIsY0FERixDQURGO0FBS0Q7QUFDRjtBQXhCSCxRQURGOztBQTRCQSxXQUFLRSxVQUFMLEdBQWtCQyxrQkFBU0MsTUFBVCxDQUFnQk4sYUFBaEIsRUFBK0IsS0FBS0gsUUFBcEMsQ0FBbEI7QUFDRDs7QUFFRCxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFFRFUsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsUUFBSSxLQUFLVixRQUFULEVBQW1CO0FBQ2pCUSx3QkFBU0csc0JBQVQsQ0FBZ0MsS0FBS1gsUUFBckM7O0FBQ0EsYUFBTyxLQUFLQSxRQUFaO0FBQ0Q7QUFDRjs7QUFwRHNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERvbSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHtRdWVyeVJlbmRlcmVyLCBncmFwaHFsfSBmcm9tICdyZWFjdC1yZWxheSc7XG5cbmltcG9ydCBJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIgZnJvbSAnLi4vY29udGFpbmVycy9pc3N1ZWlzaC10b29sdGlwLWNvbnRhaW5lcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElzc3VlaXNoVG9vbHRpcEl0ZW0ge1xuICBjb25zdHJ1Y3Rvcihpc3N1ZWlzaFVybCwgcmVsYXlFbnZpcm9ubWVudCkge1xuICAgIHRoaXMuaXNzdWVpc2hVcmwgPSBpc3N1ZWlzaFVybDtcbiAgICB0aGlzLnJlbGF5RW52aXJvbm1lbnQgPSByZWxheUVudmlyb25tZW50O1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb25zdCByb290Q29udGFpbmVyID0gKFxuICAgICAgICA8UXVlcnlSZW5kZXJlclxuICAgICAgICAgIGVudmlyb25tZW50PXt0aGlzLnJlbGF5RW52aXJvbm1lbnR9XG4gICAgICAgICAgcXVlcnk9e2dyYXBocWxgXG4gICAgICAgICAgICBxdWVyeSBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnkoJGlzc3VlaXNoVXJsOiBVUkkhKSB7XG4gICAgICAgICAgICAgIHJlc291cmNlKHVybDogJGlzc3VlaXNoVXJsKSB7XG4gICAgICAgICAgICAgICAgLi4uaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBgfVxuICAgICAgICAgIHZhcmlhYmxlcz17e1xuICAgICAgICAgICAgaXNzdWVpc2hVcmw6IHRoaXMuaXNzdWVpc2hVcmwsXG4gICAgICAgICAgfX1cbiAgICAgICAgICByZW5kZXI9eyh7ZXJyb3IsIHByb3BzLCByZXRyeX0pID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gPGRpdj5Db3VsZCBub3QgbG9hZCBpbmZvcm1hdGlvbjwvZGl2PjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcHMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDxJc3N1ZWlzaFRvb2x0aXBDb250YWluZXIgey4uLnByb3BzfSAvPjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItTG9hZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItU3Bpbm5lclwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgICB0aGlzLl9jb21wb25lbnQgPSBSZWFjdERvbS5yZW5kZXIocm9vdENvbnRhaW5lciwgdGhpcy5fZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9lbGVtZW50KSB7XG4gICAgICBSZWFjdERvbS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuX2VsZW1lbnQpO1xuICAgICAgZGVsZXRlIHRoaXMuX2VsZW1lbnQ7XG4gICAgfVxuICB9XG59XG4iXX0=